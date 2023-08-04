const express = require('express');
const rapoortController = require('../controllers/RapportController');

const router = express.Router();

router.get('/getAll/:id', rapoortController.getStatByAppel);
router.get('/getOffre/:id', rapoortController.getOffreByAppel);
router.get('/getChiffre/:id', rapoortController.getChiffrePerSecteurByAppel);
router.get('/getChiffreSecteur/', rapoortController.getChiffrePerSecteur);
router.get('/getStat/:id', rapoortController.getStatPerSecteurByAppel);
router.get('/getNbSoumByAppel/', rapoortController.getNbSoumByAppel);

module.exports = router;
