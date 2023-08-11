"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentCsv = exports.insert = exports.createTable = void 0;
const configDB_js_1 = require("../configDB.js");
async function createTable() {
    (0, configDB_js_1.openDb)().then((db) => db.exec("CREATE TABLE IF NOT EXISTS Csv( filepath varchar PRIMARY KEY, userId varchar,filename varchar)"));
}
exports.createTable = createTable;
async function insert(userId, filename, filepath) {
    (0, configDB_js_1.openDb)().then((db) => db.run(`Insert into Csv (filepath,userId,filename) values ('${filepath}','${userId}','${filename}');`));
}
exports.insert = insert;
async function getRecentCsv(userId) {
    await (0, configDB_js_1.openDb)()
        .then((db) => db.all(` Select * from Csv where Csv.idUser='${userId}';`))
        .then((rows) => rows);
}
exports.getRecentCsv = getRecentCsv;
