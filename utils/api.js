'use strict';

import request from 'superagent';
import { Parser } from 'react-native-xml2js';
import moment from 'moment';

const parser = new Parser({ mergeAttrs: true, charkey: 'val', async: false });
// const server = os.hostname();
// const PORT = server === "localhost" ? 8000 : 80;

const server = '';
const PORT = 80;

var days = null;
function fetchData(start, end, int, skip, url) {
  days = skip;
  const endPoint =
    url || 'http://www.zacharycrumbo.com/widgets/solar-vanilla/solar-xml.php';
  return new Promise((resolve, reject) => {
    request
      .post(endPoint)
      .set('Accept', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send({
        start,
        end,
        interval: int || 'd',
        skip: skip || 363,
      })
      .end((err, res) => {
        if (err) reject('server error');
        parser.parseString(res.text, (err, results) => {
          if (err) reject('xml parse error');
          resolve(results.group.data[0]);
        });
      });
  });
}
function fetchDataProxy(start, end, int, skip) {
  days = skip;
  const endPoint = `http://${server}:${PORT}/api/proxy/saved`;
  return new Promise((resolve, reject) => {
    request
      .post(endPoint)
      .set('Accept', 'application/json')
      .set('Content-type', 'application/json')
      .send({
        start,
        end,
        interval: int || 'd',
        skip: skip || 363,
      })
      .end((err, res) => {
        if (err) reject(new Error('server error'));
        if (!res.text) reject(new Error('no text in response'));
        parser.parseString(res.text, (err, results) => {
          if (err) reject(new Error('xml parse error'));
          results.group.data[0].start = start;
          resolve(results.group.data[0]);
        });
      });
  });
}
function fetchDataInstant() {
  const uri = `http://${server}:${PORT}/api/proxy/instant`;
  return new Promise((resolve, reject) => {
    request.post(uri).end((err, res) => {
      if (err) reject(new Error(err));
      parser.parseString(res.text.trim(), (err, results) => {
        if (err) reject(err);
        if (results) resolve(processResultsIns(results));
      });
    });
  });
}
function processResultsPie(resObj) {
  let procObj = {};
  resObj.r[0].c.forEach((el, index) => {
    let name = resObj.cname[index].val
      .replace(/[D\s]/g, '_')
      .replace(/[!@|]/g, '')
      .toLowerCase();

    procObj[name] = (el - resObj.r[resObj.r.length - 1].c[index]) / 3600000;
  });
  return procObj;
}

function processResultsLine(resObj) {
  //console.log(resObj)
  let procObj = {};
  resObj.r[0].c.forEach((el, index) => {
    let name = resObj.cname[index].val
      .replace(/[D\s]/g, '_')
      .replace(/[!@|]/g, '')
      .toLowerCase();

    procObj[name] = resObj.r.map((row, i, array) => {
      if (array[i - 1]) {
        return {
          date: moment
            .unix(resObj.start)
            .add(resObj.time_delta[0] * (array.length - i), 'seconds')
            .format('MM DD YY HH:mm'),
          kwh: (array[i - 1].c[index] - row.c[index]) / 3600000,
        };
      }
    });
  });
  return procObj;
}

function processResultsIns(resObj) {
  const procObj = {
    instant: {
      generation: parseInt(resObj.data.r[1].i[0]),
      consumption:
        parseInt(resObj.data.r[0].i[0]) + parseInt(resObj.data.r[1].i[0]),
    },
  };
  return procObj;
}

export {
  fetchData,
  fetchDataProxy,
  fetchDataInstantProxy,
  processResultsPie,
  processResultsLine,
  processResultsIns,
};
