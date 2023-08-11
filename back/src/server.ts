import { createTable, getRecentCsv, insert } from './controller/Csv.js'
import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { storage } from './multer.config.js'
import { openDb } from './configDB.js'
import readline from 'readline'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(express.json())
app.use(cors())

createTable()
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'text/csv') {
      return cb(null, true)
    }
    return cb(new Error('Formato incorreto'))
  },
})

//get data from uploaded file
app.get('/api/users', function (req, res) {
  let result: any = []

  try {
    const line = readline.createInterface({
      input: fs.createReadStream(path.resolve('uploads') + '/' + req.query.csvPath),
    })
    let firstLine = false
    let namesColumns: string[] = []
    line.on('close', (data: any) => {
      res.json(result)
    })
    line.on('line', (data) => {
      if (!firstLine) {
        namesColumns = data.split(',')
        firstLine = true
      } else {
        let lineSplit = data.split(',')

        if (req.query.q && req.query.q != '') {
          let q: string = req.query.q as string
          let exists = false
          lineSplit.forEach((element) => {
            if (
              element.toLocaleUpperCase() == q.toLocaleUpperCase() ||
              element.toLocaleUpperCase().indexOf(q.toLocaleUpperCase()) != -1
            ) {
              exists = true
            }
          })
          if (exists) {
            let json = {}
            for (let i = 0; i < namesColumns.length; i++) {
              json[namesColumns[i]] = lineSplit[i]
            }
            result.push(json)
          }
        } else {
          let json = {}
          for (let i = 0; i < namesColumns.length; i++) {
            json[namesColumns[i]] = lineSplit[i]
          }
          result.push(json)
        }
      }
    })
  } catch (error) {}
})

//get recent uploaded files
app.get('/api/files/recent', async function (req, res) {
  // await getRecentCsv(req.query.userId).then(rows =>{
  // res.json(rows) });
  try {
    await openDb()
      .then((db) => db.all(` Select * from Csv where Csv.userId='${req.query.userId}';`))
      .then((rows) => res.json(rows))
  } catch (error: any) {
    throw new Error(error)
  }
})

//upload file
app.post('/api/files', upload.single('file'), (req, res) => {
  let userId = req.body.userId

  //create data into database
  if (userId == '') {
    userId = uuidv4()
  }
  if (req.file) {
    insert(userId, req.file.originalname.split('.')[0], req.file.filename)
    res.status(200).json({ userId: userId, filepath: req.file.filename })
  } else {
    res.status(400).send()
  }
})

export default app
