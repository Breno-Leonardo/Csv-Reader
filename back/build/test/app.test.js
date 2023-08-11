"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const fs_1 = __importDefault(require("fs"));
const server_1 = __importDefault(require("../server"));
const node_test_1 = require("node:test");
const testCsvData = `Name,Age,Email
John,30,john@example.com
Jane,25,jane@example.com`;
describe('CSV Upload API', function () {
    let testUserId;
    let path;
    it('should upload a CSV file', function (done) {
        (0, supertest_1.default)(server_1.default)
            .post('/api/files')
            .field('userId', '')
            .attach('file', Buffer.from(testCsvData), {
            filename: 'test.csv',
            contentType: 'text/csv',
        })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            (0, chai_1.expect)(res.body).to.have.property('userId').that.is.a('string');
            (0, chai_1.expect)(res.body).to.have.property('filepath').that.is.a('string');
            path = res.body.filepath;
            testUserId = res.body.userId;
            done();
        });
    });
    it('should get the recent uploaded files for a specific user', function (done) {
        (0, supertest_1.default)(server_1.default)
            .get('/api/files/recent')
            .query({ userId: testUserId })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            (0, chai_1.expect)(res.body).to.be.an('array');
            (0, chai_1.expect)(res.body).to.have.lengthOf(1);
            (0, chai_1.expect)(res.body[0]).to.have.property('userId', testUserId);
            (0, chai_1.expect)(res.body[0]).to.have.property('filepath').that.is.a('string');
            (0, chai_1.expect)(res.body[0]).to.have.property('filename').that.is.a('string');
            done();
        });
    });
    it('should get data from the uploaded CSV file', function (done) {
        (0, supertest_1.default)(server_1.default)
            .get('/api/users')
            .query({ userId: testUserId, csvPath: path })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            (0, chai_1.expect)(res.body).to.be.an('array');
            (0, chai_1.expect)(res.body).to.have.lengthOf(2);
            (0, chai_1.expect)(res.body[0]).to.deep.equal({
                Name: 'John',
                Age: '30',
                Email: 'john@example.com',
            });
            (0, chai_1.expect)(res.body[1]).to.deep.equal({
                Name: 'Jane',
                Age: '25',
                Email: 'jane@example.com',
            });
            done();
        });
    });
    it('should return 400 if the file format is incorrect', function (done) {
        (0, supertest_1.default)(server_1.default)
            .post('/api/files')
            .field('userId', '')
            .attach('file', Buffer.from('Invalid File'), {
            filename: 'invalid.txt',
            contentType: 'text/txt',
        })
            .expect(500, done);
    });
    it('should filter data based on query parameter', function (done) {
        (0, supertest_1.default)(server_1.default)
            .get('/api/users')
            .query({ userId: testUserId, csvPath: path, q: 'Jane' })
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            (0, chai_1.expect)(res.body).to.be.an('array');
            (0, chai_1.expect)(res.body).to.have.lengthOf(1);
            (0, chai_1.expect)(res.body[0]).to.deep.equal({
                Name: 'Jane',
                Age: '25',
                Email: 'jane@example.com',
            });
            done();
        });
    });
    (0, node_test_1.after)(function (done) {
        // Clean up - delete the uploaded file after tests are done
        const filePath = path.join('uploads', path);
        fs_1.default.unlink(filePath, done);
    });
});
