var express = require('express');
var router = express.Router();
var request = require('request') //request module used for easy get requests.
var updateDB = require('../lib/StoreData');

var d = new Date();
var startDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 2);
var endDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
var minMagnitude = 0;
var maxMagnitude = 10;

setInterval(function() {
  getIcelandicQuakeData();
}, 1 * 60 * 1000);

setInterval(function() {
  getWorldQuakeData(startDate, endDate, minMagnitude, maxMagnitude);
}, 2 * 60 * 1000);


/* GET and POST Home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'The Amateur Geologist Federation'
  });
});

router.get('/data', function(req, res) {
  updateDB.getAllData(null, function(data) {
    var info = {
      'info': data.rows
    }
    res.send(info);
  });
});


/*
================================================================================
MIDDLEWARE
================================================================================
*/
function getWorldQuakeData(start, end, min, max) {
  var originUrl = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&';
  var startTime = '&starttime=' + start;
  var endTime = '&endtime=' + end;
  var minmagnitude = '&minmagnitude=' + min;
  var maxmagnitude = '&maxmagnitude=' + max;
  var fetchUrl = originUrl + startTime + endTime + minmagnitude + maxmagnitude;
  console.log(fetchUrl);
  request(fetchUrl, function(err, res, body) {
    console.log("fetching World data..");
    var data = JSON.parse(body);
    updateDB.updateTablesUSGS(data.features);
  });
}

function getIcelandicQuakeData() {
  var url = "http://apis.is/earthquake/is";
  request(url, function(err, res, body) {
    console.log("Icelandic Data");
    var data = JSON.parse(body);
    updateDB.updateTablesAPIS(data.results);
  });
}

module.exports = router;
