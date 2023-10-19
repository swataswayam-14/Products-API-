const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'name of the product must be provided']
    },
    price: {
        type: Number,
        required: [true , 'price of the product must be provided'],
    },
    featured: {
        type: Boolean,
        default: true,
    },
    rating:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: [true, 'Must provide the date in which the item is created'],
    },
    company:{
        type:String,
        enum: {
            values: ['Casa living','Dutin','LG','Samsung'],
            message: '{VALUE} is not supported',
        },
    },
})

module.exports = mongoose.model('Product', productSchema)