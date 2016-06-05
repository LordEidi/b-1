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

var log = require('./log').log;
var config = require('../config').config;
var SENSOR = require('./db').SENSOR;
var SENSORDATA = require('./db').SENSORDATA;

// pj sends ballot
function storeSensorData(req, res, deviceId, sensorId, key, value)
{
    if(deviceId == undefined || deviceId == null || sensorId == undefined || sensorId == null
        || key == undefined || key == null || value == undefined || value == null)
    {
        // Bad Request
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("Not all parameters were given.");
        return;
    }

    //var key = key.replace(/[^0-9]/gi, '');
    //var val = value.replace(/[^0-9]/gi, '');

    SENSOR.findOrCreate({where: {sensorId: sensorId} })
        .spread( function(sensor, created) {

            SENSORDATA.create({ key: key, value: value }, { }).then(function(sensorData) {

                sensorData.setSensor(sensor);

                sensorData.save().then(function() {})

            })

            sensor.lastSeen = Date.now();
            sensor.save().then(function()
            {
                log.info('Sensor ' + deviceId + ' lastSeen updated');
            });
            // console.log(created)
        });

    res.writeHead(202, {'Content-Type': 'text/plain'});
    res.write("Data accepted: " + sensorId + " {" + key + ":" + value + "}");
    res.end();
}

// url to be processed is unknown
function onBypass(req, res, path)
{
    log.info('URL unknown: ' + path);

    // send out some help text to get started
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<!doctype html>\n\r<html lang=en>\n\r<head>\n\r<meta charset=utf-8>\n\r<title>B-1</title>\n\r</head>\n\r");
    res.write("<body>\n\r");

    res.write("<h1>Welcome to B-1</h1>\n\r");

    res.write("</body>\n\r");
    res.write("</html>\n\r");
    res.end("");
}

// Exporting.
module.exports = {
    storeSensorData: storeSensorData,
    onBypass: onBypass
};