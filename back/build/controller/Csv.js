"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentCsv = exports.insert = exports.createTable = void 0;
const configDB_js_1 = require("../configDB.js");
function createTable() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, configDB_js_1.openDb)().then((db) => db.exec("CREATE TABLE IF NOT EXISTS Csv( filepath varchar PRIMARY KEY, userId varchar,filename varchar)"));
    });
}
exports.createTable = createTable;
function insert(userId, filename, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, configDB_js_1.openDb)().then((db) => db.run(`Insert into Csv (filepath,userId,filename) values ('${filepath}','${userId}','${filename}');`));
    });
}
exports.insert = insert;
function getRecentCsv(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, configDB_js_1.openDb)()
            .then((db) => db.all(` Select * from Csv where Csv.idUser='${userId}';`))
            .then((rows) => rows);
    });
}
exports.getRecentCsv = getRecentCsv;
