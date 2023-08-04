// controllers/ParticipanttController.js
const AppelLot = require('../models/AppelLot');

exports.getAllAppelLot = (req, res) => {
  AppelLot.getAllAppelLot((err, results) => {         //req=vue , res=vue
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' }); //500:code erreur ,404:page note found,200:demande shyhaa ,2001:
    } else {
      res.status(200).json({data:results});
    }
  });
};

exports.getAllAppelLotByAppel = (req, res) => {
  const id = req.params.id;
  AppelLot.getAllAppelLotByAppel(id, (err, results) => {         //req=vue , res=vue
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' }); //500:code erreur ,404:page note found,200:demande shyhaa ,2001:
  } else {
    res.status(200).json({data:results});
  }
});
};

exports.getNbLotPerAppel = (req, res) => {
  AppelLot.getNbLotPerAppel((err, results) => {         //req=vue , res=vue
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' }); //500:code erreur ,404:page note found,200:demande shyhaa ,2001:
  } else {
    res.status(200).json(results);
  }
});
};

exports.getAppelLotById = (req, res) => {
  const id = req.params.id;
  AppelLot.getAppelLotById(id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'AppelLot not found' });
    } else {
      res.status(200).json(results[0]); //resul=tableau
    }
  });
};

exports.createAppelLot = (req, res) => {
  const  {id_appel, lot} = req.body;
  const newAppelLot = {id_appel, lot};
  AppelLot.createAppelLot(newAppelLot, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'AppelLot created' });
    }
  });
};

exports.updateAppelLot = (req, res) => {
  const id = req.params.id;
  const  {id_appel, lot} = req.body;
  const updateAppelLot =  {id_appel, lot};
  AppelLot.updateAppelLot(id, updateAppelLot, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'AppelLot not found' });
    } else {
      res.status(200).json({ message: 'AppelLot updated' });
    }
  });
};

exports.deleteAppelLot = (req, res) => {
  const id = req.params.id;
  AppelLot.deleteAppelLot(id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'AppelLot not found' });
    } else {
      res.status(200).json({ message: 'AppelLot deleted' });
    }
  });
};
