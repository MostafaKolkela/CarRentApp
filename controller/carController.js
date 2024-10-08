const asyncWrapper = require('../middleware/asyncWraper')
const Cars = require('../model/carModel')
const appError = require('../utils/appError')
const httpStausText = require('../utils/httpStatusText')


const getCars = asyncWrapper(
    async (req,res,next)=>{
        const query = req.query
        const limit = query.limit || 10
        const page = query.page || 1
        const skip = (page - 1) * limit
        const cars = Cars.find({},{"__v":false}).limit(limit).skip(skip)
        res.status(200).json({status:httpStausText.SUCCESS,data:{cars}})
    }
)

const getCar = asyncWrapper(
    async (req,res,next)=>{
        const car = await Cars.findById(req.params.carId).select('-__v')
        if(!car){
            const error = appError.create('car not found',404,httpStausText.ERROR)
            return next(error)
        }
        res.status(200).json({status:httpStausText.SUCCESS,data:{car}})
    }
)

const addCar = asyncWrapper(
    async (req,res,next)=>{
        const newCar = new Cars({
            ...req.body
        })
        await newCar.save()
        return res.status(201).json({status:httpStausText.SUCCESS,data:{newCar}})
    }
)

const deleteCar = asyncWrapper(
    async (req,res,next)=>{
        const car = await Cars.findById(req.params.CarId)
        if(!car){
            const error = appError.create('car not found',404,httpStausText.ERROR)
            return next(error)
        }
        await Cars.deleteOne({_id:req.params.CarId})
        res.status(200).json({success:httpStausText.SUCCESS,data:null});
    }
)

const updateCar = asyncWrapper(
    async (req,res,next)=>{
       
    }
)

module.exports = {
    getCars,
    getCar,
    addCar,
    deleteCar,
    updateCar
    
}