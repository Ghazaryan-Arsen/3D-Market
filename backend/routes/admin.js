const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Model = require('../models/Model');
const Purchase = require('../models/Purchase');

// @route   GET api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalModels = await Model.countDocuments();
        const totalSales = await Purchase.countDocuments();
        const totalRevenue = await Purchase.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$commission' }
                }
            }
        ]);

        res.json({
            totalUsers,
            totalModels,
            totalSales,
            totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/models
// @desc    Get all models
// @access  Private/Admin
router.get('/models', [auth, admin], async (req, res) => {
    try {
        const models = await Model.find().populate('user', ['name']);
        res.json(models);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/models/:id
// @desc    Delete a model
// @access  Private/Admin
router.delete('/models/:id', [auth, admin], async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Model removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
