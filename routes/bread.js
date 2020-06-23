var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET users listing. */
module.exports = (db) => {
  //SHOW DATA
  router.get('/', function (req, res, next) {

    // let dataSearch = [];
    // let search = false;
    // const { checkId, id, checkString, string, checkInteger, integer, checkFloat, float, checkDate, startDate, endDate, checkBoolean, boolean } = req.query;

    // if (checkId && id) {
    //   dataSearch.push(`id = ${id}`)
    //   search = true;
    // }

    // if (checkString && string) {
    //   dataSearch.push(`string = ${string}`)
    //   search = true;
    // }

    // if (checkInteger && integer) {
    //   dataSearch.push(`integer = ${integer}`)
    //   search = true;
    // }

    // if (checkFloat && float) {
    //   dataSearch.push(`float = ${float}`)
    //   search = true;
    // }

    // if (checkDate && startDate && endDate) {
    //   dataSearch.push(`date BETWEEN ${startDate} AND ${endDate}`)
    //   search = true;
    // }

    // if (checkBoolean && boolean) {
    //   dataSearch.push(`booelan = ${boolean}`)
    //   search = true;
    // }

    // let searchFinal = "";
    // if (search) {
    //   searchFinal += `WHERE ${dataSearch.join(' AND ')}`
    // }

    // console.log(searchFinal)

    // const page = req.query.page || 1
    // const limit = 3
    // const offset = (page - 1) * limit


    // db.query(`SELECT COUNT (id) as total FROM bread`, (err, rows) => {
    //     if (err) {
    //         return console.error(err.message)
    //     } else if (rows == 0) {
    //         return res.send('data tidak di temukan')
    //     } else {
    //         total = rows[0].total
    //         const pages = Math.ceil(total / limit)


    //         // console.log(pages)
    //         // console.log(searchFinal)


    //         let sql = `SELECT * FROM bread ${searchFinal} LIMIT ? OFFSET ?`
    //         db.query(sql, [limit,offset], (err, rows) => {

    //             if (err) {
    //                 return console.error(err.message)
    //             } else if (rows == 0) {
    //                 return res.send('data can not be found');
    //             } else {
    //                 let data = [];
    //                 rows.forEach(row => {
    //                     data.push(row);
    //                 });
    //                 // console.log(data)
    //                 res.render('index', { data, page, pages })

    //             }
    //         })
    //     }
    // })



    db.query('SELECT * FROM bread', (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      for(let i = 0;i< data.rows.length;i++){ 
      data.rows[i].datedata = moment(data.rows[i].datedata).format('YYYY-MM-DD')
      }
      res.status(200).json(
        data.rows
      )
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

