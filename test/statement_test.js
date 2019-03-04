var fs = require('fs');
var expect = require('chai').expect;
var should = require('chai').should();

import statement from '../statement.js';

describe('Statement', function() {
  it('prints bill', function() {
    var inv_json = JSON.parse(fs.readFileSync('./invoices.json', 'utf8'));
    var plays_json = JSON.parse(fs.readFileSync('./plays.json', 'utf8'));
    //console.log(inv_json[0]);
    //console.log(plays_json);
    var bill = statement(inv_json[0], plays_json);
    expect(bill).equal("Statement for BigCo\n\
 Hamlet: $650.00 (55 seats)\n\
 As You Like It: $580.00 (35 seats)\n\
 Othello: $500.00 (40 seats)\n\
Amount owed is $1,730.00\n\
You earned 47 credits\n");
  });
});
