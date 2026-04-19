const Counter = require('../models/counterModel');

const autoIncrement = (schema, collectionId) => {
    schema.pre('save', async function (next) {
        if (!this.isNew) return next();
        const counter = await Counter.findByIdAndUpdate(
            collectionId,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
        next();
    });
};

module.exports = autoIncrement;