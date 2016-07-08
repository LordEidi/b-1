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
function readSensorData(req, res, deviceId, sensorId, duration)
{
    var filter = {};

    if(deviceId != undefined && deviceId != null && sensorId != undefined && sensorId != null)
    {
        filter.sensorId = deviceId + ":" + sensorId;
    }

    if(duration != undefined && duration != null)
    {
        var now = moment();
        var dur = moment.duration(duration.toUpperCase());

        filter.createdAt = { $gte: now.subtract(dur) };
    }

    res.writeHead(200, {'Content-Type': 'application/json'});

    // attributes: ['ballot', [sequelize.fn('count', sequelize.col('ballot')), 'ballotcount']],
    //group: ["PJ.ballot"],

    var rs = {};
    var sendorIds = {};
    var dates = [];

    SENSORDATA.findAll({
            include: [{
                model: SENSOR, as: 'sensor' }],
            where: filter,
            order: [ ["sensorId", "ASC"], ["createdAt", "ASC"]]
        }).then(function (result) {

        var data = "";
            result.forEach(function(rec) {
                var crtdat = rec.createdAt;
                var sensor = rec.sensorId;
                var value = rec.value;

                rs[sensor] = rs[sensor] || {};
                rs[sensor][crtdat] = value;

                if(!sendorIds.hasOwnProperty(sensorId))
                {
                    sendorIds[sensor] = rec.sensor.name ? rec.sensor.name : rec.sensorId;
                }

                var dateAsString = moment(crtdat).format("Y-MM-DDTHH:mm:ss");
                if(dates.indexOf(dateAsString) < 0)
                {
                    dates.push(dateAsString);
                }
            })

        data += "\"dates\": [";
        for (var i = 0; i < dates.length; i++)
        {
            if(i > 0)
            {
                data += ",";
            }
            data += "\"" + dates[i] + "\"";
        }
        data += "],";

        var outerCount = 0;
        var innerCount = 0;
        for (var key in rs) {
            // skip loop if the property is from prototype
            if (!rs.hasOwnProperty(key)) continue;

            var obj = rs[key];

            // your code
            if(outerCount > 0)
            {
                data += ",";
            }
            data += "\"";
            data += sendorIds[key];
            data += "\": [";
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;

                // TODO: skip loop if there is no value for this timestamp
                // or not skipping loop but adding a zero
                if(innerCount > 0)
                {
                    data += ",";
                }
                data += obj[prop];

                innerCount++;
            }
            data += "]";
            outerCount++;
            innerCount = 0;
        }

            log.info(data);

            var json = util.format("{%s}", data);

            res.end(json);
    });
}

// Exporting.
module.exports = {
    readSensorData: readSensorData
};