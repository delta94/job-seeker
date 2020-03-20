const express = require('express')
const userController = require('./controller')
const router = express.Router()
const passportService = require('../../../middlewares/auth');
const { authorize } = require('../../../middlewares/auth');
const { uploadImage } = require("../../../middlewares/uploadImage")
const requireToken = passportService.authenticateJWT;
const { validateCreateUser } = require('../../../middlewares/validate.createUser')
router.post('/register', validateCreateUser, userController.register)
router.post('/login', userController.login)
router.get('/posted/:jobId', requireToken, authorize(["Recruiter"]), userController.recruiterCheck)
router.get('/applied', requireToken, authorize(["Job Seeker"]), userController.seekerCheck)
router.delete('/:jobId', requireToken, authorize(["Recruiter", "Admin"]), userController.deleteJob)
module.exports = router