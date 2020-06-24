var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET users listing. */
module.exports = (db) => {

  //SHOW DATA
  router.get('/', function (req, res, next) {

    let dataSearch = [];
    const page = req.query.page || 1

    // console.log(req.query)

    if (req.query.checkId && req.query.id) {
      dataSearch.push(`id = ${req.query.id}`)
    }

    if (req.query.checkString && req.query.string) {
      dataSearch.push(`stringdata = ${req.query.string}`)
    }

    if (req.query.checkInteger && req.query.integer) {
      dataSearch.push(`integerdata = ${req.query.integer}`)
    }

    if (req.query.checkFloat && req.query.float) {
      dataSearch.push(`floatdata = ${req.query.float}`)
    }

    if (req.query.checkDate && req.query.startDate && req.query.endDate) {
      dataSearch.push(`datedata BETWEEN ${req.query.startDate} AND ${req.query.endDate}`)
    }

    if (req.query.checkBoolean && req.query.boolean) {
      dataSearch.push(`booleandata = ${req.query.boolean}`)
    }

    let searchFinal = "";
    if (dataSearch.length > 0) {
      // console.log(dataSearch)
      searchFinal += `WHERE ${dataSearch.join(' AND ')}`
    }
    // console.log(searchFinal)


    const limit = 4
    const offset = (page - 1) * limit

    let sqlPages = `SELECT COUNT (id) as total FROM bread ${searchFinal}`
    console.log(sqlPages)
    db.query(sqlPages, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      else if (data.rows[0].total == 0) {
        return res.send('data tidak di temukan')
      }
      // console.log(data.rows[0].total)

      const total = parseInt(data.rows[0].total)
      const pages = Math.ceil(total / limit)


      // console.log(pages)
      // console.log(offset)
      
      let sql = `SELECT * FROM bread ${searchFinal} ORDER BY id LIMIT $1 OFFSET $2`
      db.query(sql, [limit, offset], (err, data) => {
        if (err) return res.status(500).json({
          error: true,
          message: err
        })
        for (let i = 0; i < data.rows.length; i++) {
          data.rows[i].datedata = moment(data.rows[i].datedata).format('YYYY-MM-DD')
        }
        res.status(200).json({
          data: data.rows, pages, page

        })
      })

    })




  });

  //SHOW DATA MODAL EDIT
  router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let sql = `SELECT * FROM bread WHERE id = ${id}`;

    db.query(sql, (err, data) => {
      if (err) {
        return res.send(err);
      } else if (data.rows == 0) {
        return res.send(`data tidak ada`);
      }
      else {
        data.rows[0].datedata = moment(data.rows[0].datedata).format('YYYY-MM-DD')
        res.status(200).json({
          data: data.rows[0]

        })
      }
    })
  })




  //ADD DATA
  router.post('/', function (req, res, next) {

    let sql = 'INSERT INTO bread(stringdata,integerdata,floatdata,booleandata,datedata) VALUES($1,$2,$3,$4,$5)'
    let values = [req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata]
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'ADD COMPLETE'
      });
    })
  });

  //EDIT DATA
  router.put('/:id', function (req, res, next) {

    let sql = 'UPDATE bread SET stringdata=$1, integerdata=$2, floatdata=$3, booleandata=$4, datedata=$5 WHERE id=$6'
    let values = [req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata, parseInt(req.params.id)]
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'UPDATE COMPLETE'
      });
    })
  });

  //DELETE DATA
  router.delete('/:id', function (req, res, next) {

    let sql = 'DELETE FROM bread WHERE id=$1'
    let values = [parseInt(req.params.id)]
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'DELETE COMPLETE'
      });
    })
  });


  return router;
}