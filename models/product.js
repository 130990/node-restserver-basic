const { Schema, model } = require('mongoose');

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    state: {
        type: Boolean,
        default:true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default:0,
    },
    img: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
});

productSchema.methods.toJSON = function () {
    const { __v, state, ...product } = this.toObject();
    return product;
}

module.exports = model('Product', productSchema);