const mysql = require('mysql');
require('dotenv').config();
const bcrypt = require('bcrypt');

const createTables = async () => {
    try {
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
        });

        // Create the database if it does not exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS mystages;`);

        // Switch to the specified database
        await connection.query(`USE mystages;`);

        // SQL statements to create the tables
        const sqlStatements = [
            `CREATE TABLE IF NOT EXISTS lotissement (
            code_lotissement varchar(255) NOT NULL,
            nom varchar(255) DEFAULT NULL,
            description TEXT,
            location varchar(255) DEFAULT NULL,
            PRIMARY KEY (code_lotissement)
          );`,
            `CREATE TABLE IF NOT EXISTS vocation (
            code_vocation varchar(255) NOT NULL,
            label varchar(255) DEFAULT NULL,
            PRIMARY KEY (code_vocation)
          );`,
            `CREATE TABLE IF NOT EXISTS lot (
            code_lot varchar(255) NOT NULL,
            surface decimal(10,3) DEFAULT NULL,
            cuf varchar(100) DEFAULT NULL,
            cos varchar(100) DEFAULT NULL,
            hauteur varchar(100) DEFAULT NULL,
            nb_niveau varchar(100) DEFAULT NULL,
            lotissement varchar(255) DEFAULT NULL,
            vocation varchar(255) DEFAULT NULL,
            PRIMARY KEY (code_lot),
            FOREIGN KEY (lotissement) REFERENCES lotissement(code_lotissement),
            FOREIGN KEY (vocation) REFERENCES vocation(code_vocation)
          );`,
            `CREATE TABLE IF NOT EXISTS participant (
            code_participant varchar(255) NOT NULL,
            nom TEXT DEFAULT NULL,
            PRIMARY KEY (code_participant)
          );`,
            `CREATE TABLE IF NOT EXISTS responsable (
            id_res int(11) NOT NULL AUTO_INCREMENT,
            username varchar(255) DEFAULT NULL,
            password varchar(255) NOT NULL,
            PRIMARY KEY (id_res)
          );`,
            `CREATE TABLE IF NOT EXISTS appel_offre (
            id_appel int(11) NOT NULL AUTO_INCREMENT,
            nom varchar(255) DEFAULT NULL,
            num_appel varchar(255) DEFAULT NULL,
            date_creation date DEFAULT NULL,
            date_limite date DEFAULT NULL,
            id_resp int(11) DEFAULT NULL,
            PRIMARY KEY (id_appel),
            FOREIGN KEY (id_resp) REFERENCES responsable(id_res)
          );`,
            `CREATE TABLE IF NOT EXISTS appel_offre_lot (
            id_appel_lot int(11) NOT NULL AUTO_INCREMENT,
            id_appel int(11) NOT NULL,
            lot VARCHAR(255) NOT NULL,
            PRIMARY KEY (id_appel_lot),
            FOREIGN KEY (id_appel) REFERENCES appel_offre(id_appel),
            FOREIGN KEY (lot) REFERENCES lot(code_lot)
          );`,
            `CREATE TABLE IF NOT EXISTS retrait_cahier_de_charge (
            id_retrait int(11) NOT NULL AUTO_INCREMENT,
            description TEXT,
            date date DEFAULT NULL,
            participant varchar(255) DEFAULT NULL,
            id_appof int(11) DEFAULT NULL,
            PRIMARY KEY (id_retrait),
            FOREIGN KEY (participant) REFERENCES participant(code_participant),
            FOREIGN KEY (id_appof) REFERENCES appel_offre(id_appel)
          );`,
            `CREATE TABLE IF NOT EXISTS sous_offre (
            id_soff int(11) NOT NULL AUTO_INCREMENT,
            retrait int(11) NOT NULL,
            titre TEXT NOT NULL,
            PRIMARY KEY (id_soff),
            FOREIGN KEY (retrait) REFERENCES retrait_cahier_de_charge(id_retrait)
          );`,
            `CREATE TABLE IF NOT EXISTS soumission (
            id_soum int(11) NOT NULL AUTO_INCREMENT,
            option1 decimal(10,3) DEFAULT NULL,
            option2 decimal(10,3) DEFAULT NULL,
            principal decimal(10,3) DEFAULT NULL,
            id_s_offre int(11) DEFAULT NULL,
            lot varchar(255) DEFAULT NULL,
            PRIMARY KEY (id_soum),
            FOREIGN KEY (id_s_offre) REFERENCES sous_offre(id_soff),
            FOREIGN KEY (lot) REFERENCES lot(code_lot)
          );`,
            `CREATE TABLE IF NOT EXISTS resultat_soumission (
            id_s int(11) NOT NULL AUTO_INCREMENT,
            nbr_soumission int(11) DEFAULT NULL,
            prix_moyen_soumis decimal(10,3) DEFAULT NULL,
            meilleur_offre decimal(10,3) DEFAULT NULL,
            ca decimal(10,3) DEFAULT NULL,
            lot varchar(255) DEFAULT NULL,
            PRIMARY KEY (id_s),
            FOREIGN KEY (lot) REFERENCES lot(code_lot)
          );`
        ];




        // Create each table
        for (const statement of sqlStatements) {
            await connection.query(statement);
        }

        console.log('Tables have been created successfully!');
        connection.end();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
