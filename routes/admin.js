const router = require('express').Router(),
    { isAdmin } = require('../middleware/index'),
    Product = require('../models/product'),
    Purchase = require('../models/purchase');
var data = require("../data.json");
// multer configuration
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'picturestore',
    api_key: '833963216771655',
    api_secret: 'FvtBRNlMcNmCjy3UP3FF-1GuDTc'
});

// @route Get /admin
// @desc admin page
// @access Admin
router.get('/', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({}),
            inStock = await Product.find({ quantity: { $gt: 0 } }),
            outStock = await Product.find({ quantity: 0 }),
            orders = await Purchase.find({});
        let orderedProducts = 0, totalQuantity = 0, productSold = 0;
        orders.forEach((order) => {
            orderedProducts += order.products.length;
            order.products.forEach(ele => {
                productSold += ele.totalQuantity;
            });
        });
        products.forEach(ele => {
            totalQuantity += ele.quantity;
        });
        res.render('admin', { data: products, inStock: inStock.length, outStock: outStock.length, orders: orderedProducts, productSold, totalQuantity });
    } catch (err) {
        console.error(err);
    }
});

// @route Get /admin/delivery
// @desc list of ordered products
// @access Admin
router.get('/delivery', isAdmin, async (req, res) => {
    try {
        const items = await Purchase.find({})
            .populate('products._id');
        // res.send(items);
        return res.render('orders', { items });


    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route delete /admin/delivery/:id
// @desc delete delivered item
// @access Admin
router.delete('/delivery/:id', isAdmin, async (req, res) => {
    try {
        const order = await Purchase.findById(req.params.id);
        if (!order) {
            console.error('order not found');
        }
        await order.remove();
        return res.redirect('/admin/delivery');
    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route delete /admin/delivery/:id/cancel
// @desc delete canecelled item
// @access Admin
router.delete('/delivery/:id/cancel', isAdmin, async (req, res) => {
    try {
        const order = await Purchase.findById(req.params.id);
        if (!order) {
            console.error("order not found");
            return res.redirect('/admin');
        }
        let product;
        order.products.forEach(async (ele) => {
            product = await Product.findById(ele._id);
            product.quantity += ele.totalQuantity;
            await product.save();
        });
        await order.remove();
        return res.redirect('/admin/delivery');
    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route Get /admin/addProduct
// @desc add product page
// @access Admin
router.get('/addProduct', isAdmin, (req, res) => {
    res.render('addProducts', { data: data });
});


// @route POSt /admin/addProduct
// @desc add product page
// @access Admin
router.post('/addProduct', isAdmin, upload.single('productImage'), (req, res) => {
    const { productName, productDiscription, category, price, quantity } = req.body;
    let productImage;
    cloudinary.uploader.upload(req.file.path, (result) => {
        productImage = result.secure_url;
        const newProduct = {
            productName,
            productImage,
            productDiscription,
            category,
            price,
            quantity
        }

        Product.create(newProduct, (err, product) => {
            if (err) {
                req.flash("error", "something went wrong");
                console.error(err);
            } else {
                console.log("successfully added new product");
                console.log(product);
                req.flash("success", "successfully added new product")
                res.redirect("/admin");
            }
        });
    });
});

// @route get /admin/editProduct
// @desc get products
// @access Admin
router.get('/editProduct', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({});
        return res.render('listall', { products });
    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route get /admin/inStock
// @desc get products in stock
// @access Admin
router.get('/inStock', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $gt: 0 } });
        return res.render('instock', { products });
    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route get /admin/outStock
// @desc get products out of stock
// @access Admin
router.get('/outStock', isAdmin, async (req, res) => {
    try {
        const products = await Product.find({ quantity: 0 });
        return res.render('outstock', { products });
    } catch (err) {
        console.error(err);
        return res.redirect('/admin');
    }
});

// @route get /admin/:pid
// @desc get product
// @access Admin
router.get('/:pid', isAdmin, (req, res) => {
    Product.findById(req.params.pid, (err, product) => {
        if (err) {
            console.error(err);
            return res.redirect('/admin');
        } else {
            res.render('editProduct', { product: product });
        }
    });
});

// @route put /admin/:pid/edit
// @desc edit product
// @access Admin
router.put('/:pid/edit', isAdmin, async (req, res) => {
    const { productDiscription, quantity, price } = req.body;
    try {
        const product = await Product.findById(req.params.pid);
        product.productDiscription = productDiscription;
        product.quantity += parseInt(quantity);
        product.price = price;
        await product.save();
        req.flash("success", "Successfully edited the values");
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash("error", "could'nt edit the value");
        return res.redirect('/admin');
    }
});


// @route delete /admin/:pid/delete
// @desc delete product
// @access Admin
router.delete('/:pid/delete', isAdmin, (req, res) => {
    Product.findByIdAndRemove(req.params.pid, (err) => {
        if (err) {
            console.error(err);
            req.flash("error", "could'nt delete the product");

            return res.redirect('/admin');

        } else {
            req.flash("error", "Product deleted");
            console.log("deleted");

            res.redirect('/admin');
        }
    });
});







module.exports = router;