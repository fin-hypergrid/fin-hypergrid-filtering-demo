'use strict';

// "require" dependencies
var Hypergrid = require('fin-hypergrid'),
    makeData = require('./make-data');

// instantiate
var data = makeData(),
    grid = new Hypergrid;

grid.setData(data);

// append filter data source
grid.behavior.dataModel.append(require('datasaur-filter'));

// install api (plugin)
grid.installPlugins(require('fin-hypergrid-filtering-plugin'));

grid.properties.renderFalsy = true;
grid.properties.showFilterRow = true;

grid.behavior.dataModel.filter = grid.plugins.hyperfilter.create();

window.grid = grid;