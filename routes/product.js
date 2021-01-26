

const router = require('express').Router(),
    Product = require("../models/product"),
    Cart = require('../models/cart'),
    { isLoggedIn } = require('../middleware/index'),
    Purchase = require('../models/purchase');




// @route GET /
// @desc get landing page
// @access Public
router.get("/", (req, res) => {
    Product.find({}, (err, allProducts) => {
        if (err) {
            console.error(err);
        }
        else {
            // console.log("all data retrived");
            res.render("Landing", { data: allProducts })
        }
    })
});

// @route GET /contact
// @desc get contact
// @access Public
router.get('/contact', async (req, res) => {
    try {
        res.render('contact');
    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});

// @route GET /aboutUs
// @desc get about us page
// @access Public
router.get('/aboutUs', async (req, res) => {
    try {
        res.render('about');
    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});

// @route GET /Landing/:pid
// @desc get product info
// @access Private
router.get('/:pid', isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid),
            data = await Product.find({}),
            items = await Cart.find({ 'user.id': req.user.id });
        console.log(items);
        res.render('details', { product: product, data: data, items: items });
    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});


// @route GET /Landing/:pid/chckout
// @desc get billing page
// @access Private
router.get('/:pid/checkout', isLoggedIn, (req, res) => {
    Product.findById(req.params.pid, (err, product) => {
        if (err) {
            console.error(err);
        } else {
            res.render('checkout', { product });
        }
    });
});

// @route POST /Landing/:pid/checkout
// @desc post billing data
// @access Private
router.post('/:pid/checkout', isLoggedIn, async (req, res) => {
    let { name, email, phone, address, pincode, quantity } = req.body;
    quantity = parseInt(quantity);
    try {
        let product = await Product.findById(req.params.pid);
        if (product.quantity >= quantity) {
            product.quantity -= quantity;
            await product.save();
            const addBill = new Purchase({
                name,
                email,
                phone,
                address,
                pincode
            });
            const data = {
                _id: req.params.pid,
                totalQuantity: quantity,
                totalPrice: quantity * product.price
            }
            addBill.user.id = req.user.id;
            addBill.products.push(data);

            await addBill.save();
            const billdata = await Purchase.findById(addBill._id).populate('products._id')
            console.log(billdata);
            req.flash("success", "ordered successfully")
            return res.render('invoice', { bill: billdata });
            // return res.send(billdata)
        } else {
            console.log('not possible to add');
        }
    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});



// @route POST /Landing/:pid/addcart
// @desc add to cart
// @access Private
router.post('/:pid/addcart', isLoggedIn, async (req, res) => {
    const { quantity } = req.body;
    try {
        const product = await Product.findById(req.params.pid);
        if (product.quantity >= parseInt(quantity)) {
            product.quantity -= parseInt(quantity);
            await product.save();
            const cartItem = new Cart({
                quantity: parseInt(quantity),
                price: parseInt(quantity) * product.price
            });
            cartItem.user.id = req.user.id,
                cartItem.product.push(req.params.pid);
            await cartItem.save();
            req.flash("success", "product added to cart")
            return res.redirect('/Landing/' + req.params.pid);
        } else {
            console.log('not possible to add');
            req.flash("error", "product could not be added to cart")
            return res.redirect('/Landing');
        }

    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});


//search route
router.post('/search', (req, res) => {
    var query = req.body.query;
    var result = [];
    Product.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (query) {
                data.forEach((item) => {
                    if (item.productName.toLowerCase().match(query.toLowerCase())) {

                        result.push(item);
                    }
                })
                res.render("search", { products: result })
            }
            else {
                res.redirect("/Landing")
            }
        }
    })
})

//see more route 

router.get("/more/:category", (req, res) => {
    var category = req.params.category;
    var products = [];
    Product.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            data.forEach((item) => {
                if (item.category == category) {
                    products.push(item)
                }
            });
            res.render("more", { product: products })
        }
    })
});


module.exports = router;