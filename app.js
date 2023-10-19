const express = require('express')
const app = express()

const connectDB = require('./db/connect')//for connecting with our database
const router = express.Router()


const productsRouter = router

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const { createCustomError } = require('./middleware/custom-error')
const bodyParser = require('body-parser')
const ejs = require('ejs')
//const {createCustomError} = require('./errors/custom-error')
require('dotenv').config() // this is for keeping our secret folders and information secure

require('express-async-errors')//built-in middleware in express for error handeling
const mongoose = require('mongoose')
//app.use(express.static('./public'))
app.set('view engine','ejs')

app.use('/api/v1/products',productsRouter)


const port = process.env.PORT || 3000
app.get('/',(req,res)=>{
    res.send('Store API <a href="/api/v1/products">products route</a>')
})

//preparing the productSchema

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



app.use(errorMiddleware)
app.use(notFoundMiddleware)

app.use(express.json())

//const jsonProducts = require('./products.json')

//end of product schema
const asyncWrapper = require('./async')
const product = productSchema
const Product = mongoose.model('Product',productSchema)

//start of controllers
const getAllProducts = async(req,res) =>{
    const{featured, company, name , sort, fields , numericFilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true: false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) =>`-${operatorMap[match]}-`)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item) =>{
            const [field , operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    console.log(queryObject)
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 30
    const skip = (page-1)*limit

    result = result.skip(skip).limit(limit)


    const products = await result
    res.status(200).json({products , nbHits: products.length})
}

const createProduct = asyncWrapper(async (req,res)=>{
    const product = await Product.create(req.body)
    res.status(201).json(product)
})

const deleteProduct = asyncWrapper(async (req,res) =>{
    const {id:productID} = req.params
    const product = await Product.findByIdAndDelete({_id:productID})
    if(!product){
        return next(createCustomError(`No product with id ${productID}`,404))
    }
    res.status(200).json({product:null, status:'success'})
})

const updateProduct = asyncWrapper(async(req,res)=>{
    const {_id:productID} = req.params
    const product = await Product.findOneAndUpdate({_id:productID},req.body,{
        new:true,
        runValidators:true
    })
    if(!product){
        return next(createCustomError(`No product with id: ${productID}`,404))
    }
    res.status(200).json({product})
})

//end of controllers

//start of routes handellers
router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').patch(updateProduct).delete(deleteProduct)
//end of routes handellers

const start = async() =>{
    try {
        //connect with database
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>{
            console.log(`Server listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()


