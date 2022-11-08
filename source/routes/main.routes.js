const express = require('express');
const router = express.Router()
const auditController = require('../controllers/audit.controller')
const towerController = require('../controllers/towers.controller')
const userController = require('../controllers/user.controller')
const orthoController = require('../controllers/orthomap.controller')
const spinviewController = require('../controllers/spinview.controller')
const galleryController = require('../controllers/gallery.controller')
const digitaltwinController = require('../controllers/digitaltwin.controller')
const documentController = require('../controllers/docs.controller')
const summaryController = require('../controllers/summary.controller')
const resetPassword = require("../controllers/resetPassword.controller")
const authorize = require('../middleware/authorize.middleware')

router.use('/users',userController)
router.use('/audit',authorize(),auditController)
router.use('/towers',authorize(),towerController)
router.use('/ortho',authorize(),orthoController)
router.use('/spinview',authorize(),spinviewController)
router.use('/password',resetPassword)
router.use('/gallery',authorize(),galleryController)
router.use('/summary',authorize(),summaryController)
router.use('/digitaltwin',authorize(),digitaltwinController)
router.use('/document',authorize(),documentController)


module.exports =  router