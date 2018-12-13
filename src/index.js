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

var filterExpressionHelp = document.querySelector('a'),
    filterExpressionTextBox = document.getElementById('filter-expression'),
    expressionSyntaxChooser = document.getElementById('expression-syntax-chooser'),
    radioButtons = expressionSyntaxChooser.querySelectorAll('input[type=radio]'),
    errorBox = document.getElementById('error');

var columnNames = grid.behavior.schema.map(function(columnSchema) { return columnSchema.name; });
filterExpressionHelp.title = 'Column names:\n' + columnNames.join('\n');

filterExpressionTextBox.onkeypress = function(event) {
    if (event.key === 'Enter') {
        var checkedRadioButton = Array.prototype.find.call(radioButtons, buttonIsChecked),
            event = { target: checkedRadioButton };

        setFilter(event);
        this.blur();
    }
};

function buttonIsChecked(radioButton) {
    return radioButton.checked;
}

expressionSyntaxChooser.onchange = setFilter;

function setFilter(e) {
    var errText = '',
        expression = filterExpressionTextBox.value,
        options = {
            vars: [],
            syntax: e.target.value
        };

    try {
        grid.behavior.dataModel.setFilter(expression, options);
    } catch (err) {
        errText = err;
    }

    errorBox.innerHTML = errText;
}