const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Model = require('../models/Model');

// @route   POST api/models
// @desc    Create a new model
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, description, category, tags, price, files } = req.body;

    try {
        const newModel = new Model({
            user: req.user.id,
            name,
            description,
            category,
            tags,
            price,
            files
        });

        const model = await newModel.save();
        res.json(model);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/models
// @desc    Get all models
// @access  Public
router.get('/', async (req, res) => {
    try {
        const models = await Model.find().populate('user', ['name']).sort({ date: -1 });
        res.json(models);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/models/:id
// @desc    Get model by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const model = await Model.findById(req.params.id);

        if (!model) {
            return res.status(404).json({ msg: 'Model not found' });
        }

        res.json(model);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Model not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/models/:id
// @desc    Update a model
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, description, category, tags, price, files } = req.body;

    // Build model object
    const modelFields = {};
    if (name) modelFields.name = name;
    if (description) modelFields.description = description;
    if (category) modelFields.category = category;
    if (tags) modelFields.tags = tags;
    if (price) modelFields.price = price;
    if (files) modelFields.files = files;

    try {
        let model = await Model.findById(req.params.id);

        if (!model) return res.status(404).json({ msg: 'Model not found' });

        // Make sure user owns model
        if (model.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        model = await Model.findByIdAndUpdate(
            req.params.id,
            { $set: modelFields },
            { new: true }
        );

        res.json(model);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/models/:id
// @desc    Delete a model
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let model = await Model.findById(req.params.id);

        if (!model) return res.status(404).json({ msg: 'Model not found' });

        // Make sure user owns model
        if (model.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await model.deleteOne();

        res.json({ msg: 'Model removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Model not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
