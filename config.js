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

// Place all your configuration options here

var config =
{
    // server specific configuration
    // please use a proxy in front of fennel to support TLS
    // we suggest you use nginx as the TLS endpoint
    port: 6262,
    ip: '127.0.0.1',

    // db specific configuration. you can use whatever sequelize supports.
    db_name: 'b-1',
    db_uid: 'uid',
    db_pwd: 'pwd',
    db_dialect: 'sqlite',
    db_logging: true,
    db_storage: 'b-1.sqlite'
};

// Exporting.
module.exports = {
    config: config
};