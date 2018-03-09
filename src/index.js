'use strict';

// "require" external dependencies
var Hypergrid = require('fin-hypergrid'),
    DataModelLocal = require('datasaur-local'),
    DataModelFilter = require('datasaur-filter');

// "require" local dependencies
var makeData = require('./make-data');

// build data, data model
var data = makeData(),
    dataModel = new DataModelFilter(new DataModelLocal);

var grid = window.grid = new Hypergrid({
    dataModel: dataModel,
    data: data
});

var filterExpressionLabel = document.querySelector('label'),
    filterExpressionTextBox = document.getElementById('filter-expression'),
    traditionalSyntaxCheckBox = document.querySelector('input[type=checkbox]'),
    errorBox = document.getElementById('error');

var columnNames = grid.behavior.schema.map(function(columnSchema) { return columnSchema.name; });
filterExpressionLabel.title = 'Column names:\n' + columnNames.join('\n');

filterExpressionTextBox.onkeypress = function(event) {
    if (event.key === 'Enter') {
        setFilter();
        this.blur();
    }
};

traditionalSyntaxCheckBox.onchange = setFilter;

function setFilter() {
    var errText = '',
        expression = filterExpressionTextBox.value,
        options = {
            vars: [],
            syntax: traditionalSyntaxCheckBox.checked ? 'traditional' : 'javascript'
        };

    try {
        grid.behavior.dataModel.setFilter(expression, options);
    } catch (err) {
        errText = err;
    }

    errorBox.innerHTML = errText;
}