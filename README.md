# fin-hypergrid-filtering-demo

This app uses [`datasaur-indexed`](https://github.com/fin-hypergrid/datasaur-indexed) data model, which maps data rows from the [`datasaur-local`](https://github.com/fin-hypergrid/datasaur-indexed) data model, and can be used to demonstrate filtering.

## Running the pre-built hosted app

A pre-built version of the app is availble on GitHub pages [here](https://fin-hypergrid.github.io/fin-hypergrid-filtering-demo).

## Building it yourself

### Prerequisites
These are the versions I have. The build may or may not work with earlier versions.
```bash
git --version # git version 2.14.1
node --version # v8.9.2
npm --version # 5.7.1
npm install -g browserify # you only need to do this one time
browserify --version # 15.2.0
```

### Build & Run
From your repositories folder:
```bash
git clone https://fin-hypergrid/fin-hypergrid-filtering-demo.git
cd fin-hypergrid-filtering-demo
npm install
sh build # bundle contents of src folder into build/index.js
open index.html # opens in browser but works on Mac OS only
```

## How to filter data rows with a global filter

Run the app (see above).

### Filtering from the console
`datasaur-index` reduces row indexes, mapping rows from the underlying data source. `buildIndex` creates this map by testing each row with a predicate:
```js
function predicate(y) { return this.getValue(2, y) <= 3; }
grid.behavior.dataModel.buildIndex(predicate);
```
Observe the grid. It now only includes rows with 0, 1, 2, or 3 pets.
```js
grid.behavior.dataModel.buildIndex();
```
Now all rows are visible again.

### Filtering using the app's user interface

Just enter an expression into the **Filter** text field incorporating column names (not column headers) and hit the **Enter** key.

> NOTE: You can hover the mouse over the **Filter** label to see a list of the column names.

To remove the filter and show all rows again, blank the filter text box and hit the **Enter** key.

Check the "Accept traditional syntax" checkbox to set `datasaur-filter`'s `syntax` option to `'traditional'`.

See [`onkeypress`](https://github.com/fin-hypergrid/fin-hypergrid-filtering-demo/blob/master/src/index.js#L36-L54) in src/index.js for the handler.

## Predicate efficiency

The predicate should be written to be as efficient as possible because it is executed _for every row._ The `2` in the code above happens to be the column index of number_of_pets column. This is available by looking it up in the schema enum. For efficiency, you can keep the lookup outside the predicate (but in a closure accessible to it) because the column index is an invariant:
```js
var petsIndex = this.getSchema().number_of_pets.index;
function predicate(y) { return this.getValue(petsIndex, y) <= 3; }
```
The following would be inefficient:
```js
function predicate(y) {
    var x = this.getSchema().number_of_pets.index; // anti-pattern: invariant needlessly redefined
    return this.getValue(x, y) <= 3; }
}
```
Another approach is more readable while being fairly efficient:
```js
function predicate(y) { return this.getRow(y).number_of_pets <= 3; }
```
This is the approach favored by...

## The `datasaur-filter` data model

[`datasaur-filter`](https://github.com/fin-hypergrid/datasaur-filter), a subclass of [`datasaur-indexed`](https://github.com/fin-hypergrid/datasaur-indexed), implements `setFilter(filterStringOrPredicateOrAPI)` and `apply()`.

This `setFilter` accepts:
1. A predicate function as described above.
2. A string containing JavaScript expression which is turned into a predicate function.
3. An API containing a predicate function in a `test` method.

**Predicate function** — Just be aware that, as the `datasaur-filter` README notes, the predicate used by `setFilter` differs slightly from that of `buildIndex`, discussed above. It is called with the data row object rather than the data row index:
```js
function predicate(dataRow) { return dataRow.number_of_pets <= 3; }
grid.behavior.dataModel.setFilter(predicate);
```

**Sring** — You can send the filter string to `setFilter` as is:
```js
grid.behavior.dataModel.setFilter('nubmer_of_pewts <= 3');
```

**API**
```js
function predicate(dataRow) { return dataRow.number_of_pets <= 3; }
var API = {
    test: predicate
};
grid.behavior.dataModel.setFilter(API);
```

In any case a call to `apply` must follow eventaully:
```js
grid.behavior.dataModel.apply();
```

This app also demonstrates the `setFilter` options, `vars`, which checks the expression for syntax and reference errors at instantiation time rather than later at filter run time; and `syntax` which converts the filter expression from the named syntax to JavaScript syntax. See [`datasaur-filter`](https://github.com/datasaur-filter) for more information.
