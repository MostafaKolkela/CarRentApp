const asyncWrapper = require('../middleware/asyncWraper')
const Users = require('../model/userModel')
const appError = require('../utils/appError')
const httpStausText = require('../utils/httpStatusText')
const jwtGen = require('../utils/generateJwt')
const bcrypt = require('bcrypt')

const getUsers = asyncWrapper(
    async (req,res,next)=>{
        const query = req.query
        const limit = query.limit || 10
        const page = query.page || 1
        const skip = (page - 1) * limit
        const users = Users.find({},{"__v":false,"password":false}).limit(limit).skip(skip)
        res.status(200).json({status:httpStausText.SUCCESS,data:{users}})
    }
)

const login = asyncWrapper(
    async (req,res,next)=>{
        
    }
)

const register = asyncWrapper(
    async (req,res,next)=>{
        const oldMail = await Users.findOne({email:req.body.email})
        if(oldMail){
            const error = appError.create('dublicate email',400,httpStausText.FAIL)
            return next(error)
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const newUser = new Users({
            ...req.body,
            password:hashedPassword,
            avatar:req.file.filename
        })
        const token = await jwtGen({email:newUser.email,id:newUser._id,role:newUser.role})
        newUser.token = token
        await newUser.save()
        return res.status(201).json({status:httpStausText.SUCCESS,data:{newUser}})
    }
)

const deleteUser = asyncWrapper(
    async (req,res,next)=>{
        
    }
)


module.exports = {
    getUsers,
    login,
    register,
    deleteUser
}