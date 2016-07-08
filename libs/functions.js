/*-----------------------------------------------------------------------------
 **
 ** - B-1 -
 **
 ** Copyright 2016 by
 ** SwordLord - the coding crew - http://www.swordlord.com
 ** and contributing authors
 **
 ** This program is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU Affero General Public License as
 ** published by the Free Software Foundation, either version 3 of the
 ** License, or (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU Affero General Public License for more details.
 **
 ** You should have received a copy of the GNU Affero General Public License
 ** along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **
 **-----------------------------------------------------------------------------
 **
 ** Original Authors:
 ** LordEidi@swordlord.com
 **
 ** $Id:
 **
 -----------------------------------------------------------------------------*/

var moment = require('moment');

var log = require('./log').log;
var util = require('util');
var config = require('../config').config;
var SENSOR = require('./db').SENSOR;
var SENSORDATA = require('./db').SENSORDATA;

//

// Returns a random integer between min (included) and max (included)
function getRandomInclusive(min, max) {
    return +(Math.random() * (max - min + 1) + min).toFixed(2);
}

function addDemoDataToDB(res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});


    SENSOR.bulkCreate([
        { sensorId: 'd0:s0', name: 'temperature balcony' },
        { sensorId: 'd0:s1' },
        { sensorId: 'd1:s2', name: 'temperature wintergarden' },
        { sensorId: 'd1:s3' }
    ]).then(function() {

        SENSORDATA.bulkCreate([
            { sensorId: 'd0:s0', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(5, 'minutes') },
            { sensorId: 'd0:s0', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(3, 'minutes') },
            { sensorId: 'd0:s0', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(1, 'minutes') },
            { sensorId: 'd0:s1', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(5, 'minutes') },
            { sensorId: 'd0:s1', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(3, 'minutes') },
            { sensorId: 'd0:s1', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(1, 'minutes') },
            { sensorId: 'd1:s2', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(5, 'minutes') },
            { sensorId: 'd1:s2', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(3, 'minutes') },
            { sensorId: 'd1:s2', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(1, 'minutes') },
            { sensorId: 'd1:s3', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(5, 'minutes') },
            { sensorId: 'd1:s3', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(3, 'minutes') },
            { sensorId: 'd1:s3', key: 'temp', value: getRandomInclusive(20, 25), createdAt: moment().subtract(1, 'minutes') }
        ]).then(function() { // Notice: There are no arguments here..

            var json = JSON.stringify({
                info: 'Demo data added',
                exitCode: 0,
                programOutput: 'none'
            });

            res.end(json);
        }).catch(function(reason){

            var json = JSON.stringify({
                info: 'Demo data could not be added',
                exitCode: -1,
                programOutput: 'Data already exist?'
            });

            res.end(json);
        });

    }).catch(function(reason){

        var json = JSON.stringify({
            info: 'Demo data (Sensors) could not be added',
            exitCode: -1,
            programOutput: 'Data already exist?'
        });

        res.end(json);
    });


}
// Exporting.
module.exports = {
    addDemoDataToDB: addDemoDataToDB
};