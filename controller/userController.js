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
        const {email,password}= req.body
        if(!email || !password){
            const error = appError.create('email and password are required',400,httpStausText.FAIL)
            return next(error)
        }
        const user = await Users.findOne({email:email})
        if(!user){
            const error = appError.create('user not found',400,httpStausText.FAIL)
            return next(error)
        }
        const matchedPassword = bcrypt.compare(password,user.password)
        if(matchedPassword){
            const token = await jwtGen({email:user.email,id:user.id,role:user.role})
            return res.status(201).json({status:httpStausText.SUCCESS,data:{token}})
        }else{
            const error = appError.create('password wrong',500,httpStausText.FAIL)
            return next(error)
        }
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
            firsrName:firsrName,
            lastName:lastName,
            email:email,
            phoneNumber:phoneNumber,
            password:hashedPassword,
            avatar:req.file.filename
        })
        const token = await jwtGen({email:newUser.email,id:newUser._id,role:newUser.role})
        newUser.token = token
        await newUser.save()
        return res.status(201).json({status:httpStausText.SUCCESS,data:{newUser}})
    }
)



module.exports = {
    getUsers,
    login,
    register,
    deleteUser
}