const db = require('../config/db');

class AppelLot {
  static getAllAppelLot(callback) {
    db.query('SELECT a.nom as "offre", l.code_lot, aol.* FROM appel_offre_lot aol JOIN lot l on l.code_lot = aol.lot join appel_offre a on a.id_appel = aol.id_appel', callback);
  }

  static getAllAppelLotByAppel(id, callback) {
    db.query('SELECT a.nom as "offre", l.code_lot, aol.* FROM appel_offre_lot aol JOIN lot l on l.code_lot = aol.lot join appel_offre a on a.id_appel = aol.id_appel WHERE aol.id_appel = ?', [id], callback);
  }

  static getAppelLotById(id, callback) {
    db.query('SELECT * FROM appel_offre_lot WHERE id_appel_lot = ?', [id], callback);
  }


  static createAppelLot(data, callback) {
    db.query('INSERT INTO appel_offre_lot SET ?', data, callback);
  }

  static updateAppelLot(id, data, callback) {
    db.query('UPDATE appel_offre_lot SET ? WHERE id_appel_lot = ?', [data, id], callback);
  }

  static deleteAppelLot(id, callback) {
    db.query('DELETE FROM appel_offre_lot WHERE id_appel_lot = ?', [id], callback);
  }

  static getNbLotPerAppel(callback) {
    db.query('select count(lot) as nb , aol.id_appel , ao.nom  from appel_offre_lot aol join appel_offre ao on aol.id_appel = ao.id_appel GROUP by aol.id_appel', callback);
  }
}

module.exports = AppelLot;
