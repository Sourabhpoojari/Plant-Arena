const router = require('express').Router(),
    { isLoggedIn } = require('../middleware/index'),
    Cart = require('../models/cart'),
    Product = require('../models/product'),
    Purchase = require('../models/purchase');

// @route GEt /cart
// @desc get cart
// @access Private
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const items = await Cart.find({ 'user.id': req.user.id }).populate('product');
        // res.send(items);
        console.log(items);
        return res.render('cart', { items: items });
    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});

// @route Put /cart/:cartId
// @desc edit cart item
// @access Private
router.put('/:cartId', isLoggedIn, async (req, res) => {
    let { quantity } = req.body;
    quantity = parseInt(quantity);
    let total;
    try {
        const item = await Cart.findById(req.params.cartId);
        const product = await Product.findById(item.product[0]._id);
        if (quantity > item.quantity) {
            total = quantity - item.quantity;
            if (product.quantity >= total) {
                product.quantity -= total;
                await product.save();
                item.quantity += total;
                item.price = quantity * product.price;

                await item.save();
                return res.redirect('/cart');
            } else {
                console.log('not possible to add');
                return res.back();

            }
        } else {
            total = item.quantity - quantity;
            if (product.quantity >= total) {
                product.quantity += total;
                await product.save();
                item.quantity -= total;
                item.price = quantity * product.price;
                await item.save();
                return res.redirect('/cart');
            } else {
                console.log('not possible to add');
                return res.back();

            }
        }

    } catch (err) {
        console.error(err);
        return res.redirect('/cart');
    }
});
// @route delete /cart/:cartId
// @desc delete cart item
// @access Private
router.delete('/:cartId', isLoggedIn, async (req, res) => {
    try {
        const item = await Cart.findById(req.params.cartId);
        const product = await Product.findById(item.product[0]._id);
        product.quantity += item.quantity;
        await product.save();
        await item.remove();
        req.flash("error", "product removed form cart")
        return res.redirect('/cart');
    } catch (err) {
        console.error(err);
        req.flash("error", "product cannot be removed form cart")
        return res.redirect('/Landing');
    }
});



// @route POST /cart/checkout
// @desc add bill info
// @access Private
router.post('/checkout', isLoggedIn, async (req, res) => {
    const { name, email, phone, address, pincode } = req.body;
    try {
        const items = await Cart.find({ 'user.id': req.user.id }).populate('product');
        const addBill = new Purchase({
            name,
            email,
            phone,
            address,
            pincode
        });
        addBill.user.id = req.user.id;
        let data;
        console.log(items);
        items.forEach((ele) => {
            if (!ele) {
                console.error("item does not exist!!");
                return res.redirect('/Landing');
            }
            data = {
                _id: ele.product[0]._id,
                totalQuantity: ele.quantity,
                totalPrice: ele.price
            };
            console.log(ele);
            addBill.products.push(data);
        });
        await addBill.save();
        await Cart.deleteMany({ 'user.id': req.user.id });

        // res.send(items);
        const billdata = await Purchase.findById(addBill._id).populate('products._id')

        return res.render('invoice', { bill: billdata });

    } catch (err) {
        console.error(err);
        return res.redirect('/Landing');
    }
});

module.exports = router;