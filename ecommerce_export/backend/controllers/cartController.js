const { Cart, CartItem, Product } = require('../models');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }],
                },
            ],
        });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
    try {
        const { product_id, quantity } = req.body;

        let cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }

        // Check if item exists
        let cartItem = await CartItem.findOne({
            where: { cart_id: cart.id, product_id },
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cart_id: cart.id,
                product_id,
                quantity,
            });
        }

        res.json({ success: true, data: cartItem });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findByPk(req.params.id);

        if (cartItem) {
            cartItem.quantity = quantity;
            await cartItem.save();
            res.json({ success: true, data: cartItem });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);

        if (cartItem) {
            await cartItem.destroy();
            res.json({ success: true, message: 'Item removed from cart' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};
