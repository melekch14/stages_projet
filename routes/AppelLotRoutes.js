const express = require('express');
const AppelLotController = require('../controllers/appelLotController');

const router = express.Router();

router.get('/getAll', AppelLotController.getAllAppelLot);
router.get('/getNbLotPerAppel', AppelLotController.getNbLotPerAppel);
router.get('/getById/:id', AppelLotController.getAppelLotById);
router.get('/getByAppel/:id', AppelLotController.getAllAppelLotByAppel);
router.post('/create', AppelLotController.createAppelLot);
router.put('/update/:id', AppelLotController.updateAppelLot);
router.delete('/delete/:id', AppelLotController.deleteAppelLot);

module.exports = router;
