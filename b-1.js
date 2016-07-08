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
var config = require('./config').config;

var http = require('http');
var crossroads = require('crossroads');
crossroads.ignoreState = true;

var log = require('./libs/log').log;

var url = require('url');
var fs = require('fs');

var handler = require('./libs/handler');
var stats = require('./libs/stats');
var fncts = require('./libs/functions');

function onRedirectToRoot(req, res, path)
{
    log.info('Redirect to root URL');

    res.writeHead(301, {"Location": '/s/index.html'});

    res.end();
}

function onBypass(req, res, path)
{
    log.info('URL unknown: ' + path);

    res.writeHead(200, {'Content-Type': 'application/json'});

    var json = JSON.stringify({
        info: path,
        exitCode: -1,
        programOutput: 'function unknown'
    });

    res.end(json);
}


function onGetStaticContent(req, res, url)
{
    //res.writeHead(200, {'Content-Type': 'text/plain'});

    var file = 'wwwroot/' + url.replace(new RegExp('[^a-zA-Z0-9./-]+', 'g'), '');
    while(file.indexOf('..') != -1)
    {
        file.replace('..', '.');
    }

    log.info('File requested: ' + file);

    if(fs.existsSync(file))
    {
        fs.readFile(file, function (err, data)
        {
            if (err) throw err;
            res.write(data);

            res.end('');
        });
    }
    else
    {
        res.write('file unknown');

        res.end('');
    }
}


function onExecFunction(req, res, fnct, param1, param2, param3, param4)
{
    log.info('Exec Function: ' + fnct);

    switch (fnct) {
        case "add_demo_data":
            fncts.addDemoDataToDB(res);
            break;
        default:
            log.error("This function type is unknown: " + fnct + ".");

            res.writeHead(200, {'Content-Type': 'application/json'});

            var json = JSON.stringify({
                info: path,
                exitCode: -1,
                programOutput: 'fnct unknown'
            });

            res.end(json);
    }
}

function onSetSensorData(req, res, deviceId, sensorId, key, value)
{
    handler.storeSensorData(req, res, deviceId, sensorId, key, value)
}

function onGetSensorData(req, res, deviceId, sensorId, duration)
{
    stats.readSensorData(req, res, deviceId, sensorId, duration)
}

// -----------------------------------------------------------------------------
crossroads.addRoute('/d/s/{deviceId}/{sensorId}/{key}/{value}', onSetSensorData);
crossroads.addRoute('/d/g/:deviceId:/:sensorId:/:duration:', onGetSensorData);

crossroads.addRoute('/fn/{fnct}/:param1:/:param2:/:param3:/:param4:', onExecFunction);

crossroads.addRoute('/s/{url*}', onGetStaticContent);

crossroads.addRoute('/', onRedirectToRoot);

crossroads.bypassed.add(onBypass);

// -----------------------------------------------------------------------------
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).pathname;
    log.info("URL requested: " + sUrl);
    crossroads.parse(sUrl, [req, res]);

});

process.on('uncaughtException', function(err)
{
    console.log('Caught exception: ' + err);
});

server.listen(config.port, config.ip);

log.info("Server running at http://" + config.ip + ":" + config.port + "/");
log.debug("--");
log.debug("Load the B-1 dashboard at that url: http://" + config.ip + ":" + config.port + "/");
log.debug("--");
log.debug("Send S-1 data at that url: http://" + config.ip + ":" + config.port + "/d/s/deviceId/sensorId/key/value");
log.debug("Send S-1 data like this example: http://" + config.ip + ":" + config.port + "/d/s/9128341/sensor2/temperature/15.8");
log.debug("--");
log.debug("Send S-1 data from that url: http://" + config.ip + ":" + config.port + "/d/g/deviceId/sensorId/optional_ISO_8601_duration");
log.debug("Send S-1 data like this example: http://" + config.ip + ":" + config.port + "/d/g/9128341/sensor2/p3dt");
log.debug("--");
log.debug("Trigger creation of demo data: http://" + config.ip + ":" + config.port + "/fn/add_demo_data");
log.debug("--");
