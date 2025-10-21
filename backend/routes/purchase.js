const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Purchase = require('../models/Purchase');
const Model = require('../models/Model');

// @route   POST api/purchase
// @desc    Purchase a model
// @access  Private
router.post('/', auth, async (req, res) => {
    const { modelId } = req.body;

    try {
        const model = await Model.findById(modelId);
        if (!model) {
            return res.status(404).json({ msg: 'Model not found' });
        }

        const price = model.price;
        const commission = price * 0.2;
        const seller = model.user;
        const buyer = req.user.id;

        const newPurchase = new Purchase({
            model: modelId,
            buyer,
            seller,
            price,
            commission
        });

        const purchase = await newPurchase.save();
        res.json(purchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
