const express = require('expres')
const router = express.Router()
const carsController = require('../controller/carController')
const auth = require('../middleware/auth')
const allowedTo = require('../middleware/allowedTo')
const userRoles = require('../utils/userRoles')

router.route('/')
    .get(carsController.getCars)
    .post(auth,allowedTo(userRoles.ADMIN),carsController.addCar)

router.route('/:productId')
    .get(carsController.getCar)
    .patch(auth,allowedTo(userRoles.ADMIN),carsController.updateCar)
    .delete(auth,allowedTo(userRoles.ADMIN),carsController.deleteCar)

module.exports=router


