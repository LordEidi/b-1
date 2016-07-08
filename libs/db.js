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

var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.db_name, config.db_uid, config.db_pwd, {
    dialect: config.db_dialect,
    logging: config.db_logging,
    storage: config.db_storage,
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
});

var SENSOR = sequelize.define('sensor', {
    sensorId: { type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true},
    lastSeen: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    name: { type: Sequelize.STRING, allowNull: true}
});

var SENSORDATA = sequelize.define('sensordata', {
    sensordataId: { type: Sequelize.UUID, allowNull: false, unique: true, primaryKey: true, defaultValue: Sequelize.UUIDV4},
    key: { type: Sequelize.STRING, allowNull: false},
    value: { type: Sequelize.FLOAT, allowNull: false}
});

SENSORDATA.belongsTo(SENSOR, {foreignKey: 'sensorId', as: 'sensor'});
SENSOR.hasMany(SENSORDATA, {foreignKey: 'sensorId', as: 'sensordata'});

sequelize.sync().then(function()
    {
        log.info("Database structure updated");
    }).error(function(error)
    {
        log.error("Database structure update crashed: " + error);
    }
);

// Exporting.
module.exports = {
    SENSOR: SENSOR,
    SENSORDATA: SENSORDATA,
    sequelize: sequelize
};