const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    maker:{
        type:String,
        required:[true,"maker is required"]
    },
    modelName:{
        type:String,
        required:[true,"modelName is required"]
    },
    modelYear:{
        type:String,
        required:[true,"modelYear is required"]
    },
    pricePerHour:{
        type:String,
        required:[true,"pricePerHour is required"]
    },
})

module.exports= mongoose.model('Car',carSchema)
