import { expect } from 'chai'
import request from 'supertest'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import app from '../server'
import { after } from 'node:test'

const testCsvData = `Name,Age,Email
John,30,john@example.com
Jane,25,jane@example.com`

describe('CSV Upload API', function () {
  let testUserId
  let path

  it('should upload a CSV file', function (done) {
    request(app)
      .post('/api/files')
      .field('userId', '')
      .attach('file', Buffer.from(testCsvData), {
        filename: 'test.csv',
        contentType: 'text/csv',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.have.property('userId').that.is.a('string')
        expect(res.body).to.have.property('filepath').that.is.a('string')
        path = res.body.filepath
        testUserId = res.body.userId
        done()
      })
  })

  it('should get the recent uploaded files for a specific user', function (done) {
    request(app)
      .get('/api/files/recent')
      .query({ userId: testUserId })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0]).to.have.property('userId', testUserId)
        expect(res.body[0]).to.have.property('filepath').that.is.a('string')
        expect(res.body[0]).to.have.property('filename').that.is.a('string')
        done()
      })
  })

  it('should get data from the uploaded CSV file', function (done) {
    request(app)
      .get('/api/users')
      .query({ userId: testUserId, csvPath: path })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(2)
        expect(res.body[0]).to.deep.equal({
          Name: 'John',
          Age: '30',
          Email: 'john@example.com',
        })
        expect(res.body[1]).to.deep.equal({
          Name: 'Jane',
          Age: '25',
          Email: 'jane@example.com',
        })
        done()
      })
  })

  it('should return 400 if the file format is incorrect', function (done) {
    request(app)
      .post('/api/files')
      .field('userId', '')
      .attach('file', Buffer.from('Invalid File'), {
        filename: 'invalid.txt',
        contentType: 'text/txt',
      })
      .expect(500, done)
  })

  it('should filter data based on query parameter', function (done) {
    request(app)
      .get('/api/users')
      .query({ userId: testUserId, csvPath: path, q: 'Jane' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0]).to.deep.equal({
          Name: 'Jane',
          Age: '25',
          Email: 'jane@example.com',
        })
        done()
      })
  })
  
  after(function (done) {
    // Clean up - delete the uploaded file after tests are done
    const filePath = path.join('uploads', path)
    fs.unlink(filePath, done)
  })
})
