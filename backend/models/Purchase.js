const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'models'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    price: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
