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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Csv_js_1 = require("./controller/Csv.js");
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const multer_config_js_1 = require("./multer.config.js");
const configDB_js_1 = require("./configDB.js");
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, Csv_js_1.createTable)();
const upload = (0, multer_1.default)({
    storage: multer_config_js_1.storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            return cb(null, true);
        }
        return cb(new Error("Formato incorreto"));
    },
});
//get data from uploaded file
app.get("/api/users", function (req, res) {
    let result = [];
    try {
        const line = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(path_1.default.resolve("uploads") + "/" + req.query.csvPath),
        });
        let firstLine = false;
        let namesColumns = [];
        line.on("close", (data) => {
            res.json(result);
        });
        line.on("line", (data) => {
            if (!firstLine) {
                namesColumns = data.split(",");
                firstLine = true;
            }
            else {
                let lineSplit = data.split(",");
                if (req.query.q && req.query.q != "") {
                    let q = req.query.q;
                    let exists = false;
                    lineSplit.forEach((element) => {
                        if (element.toLocaleUpperCase() == q.toLocaleUpperCase()) {
                            exists = true;
                        }
                    });
                    if (exists) {
                        let json = {};
                        for (let i = 0; i < namesColumns.length; i++) {
                            json[namesColumns[i]] = lineSplit[i];
                        }
                        result.push(json);
                    }
                }
                else {
                    let json = {};
                    for (let i = 0; i < namesColumns.length; i++) {
                        json[namesColumns[i]] = lineSplit[i];
                    }
                    result.push(json);
                }
            }
        });
    }
    catch (error) { }
});
//get recent uploaded files
app.get("/api/files/recent", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // await getRecentCsv(req.query.userId).then(rows =>{
        // res.json(rows) });
        yield (0, configDB_js_1.openDb)()
            .then((db) => db.all(` Select * from Csv where Csv.userId='${req.query.userId}';`))
            .then((rows) => res.json(rows));
    });
});
//upload file
app.post("/api/files", upload.single("file"), (req, res) => {
    let userId = req.body.userId;
    //create data into database
    if (userId == "") {
        userId = (0, uuid_1.v4)();
    }
    if (req.file) {
        (0, Csv_js_1.insert)(userId, req.file.originalname.split(".")[0], req.file.filename);
        res.status(200).json({ userId: userId, filepath: req.file.filename });
    }
    else {
        res.status(400).send();
    }
});
exports.default = app;
