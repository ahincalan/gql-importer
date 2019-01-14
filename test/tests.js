const assert = require('assert');
const {GqlParser} = require('../src/parser');
const fs = require('fs');
const appRoot = require('app-root-path');
const rimraf = require('rimraf');
const {typeQuery} = require('../src/query');

describe('Parser prepare and properties tests', function() {

  let parser;
  const options = {
    url: 'http://localhost:5000/api'
  };

  beforeEach(() => {
    parser = new GqlParser(options);
  });

  it('Should create parser', () => {
    assert.strictEqual(parser instanceof GqlParser, true);
  });

  it('Should validate default fileName property', () => {
    assert.strictEqual(parser.fileName, 'schema-types.ts');
  });

  it('Should set typeFileName option validate fileName property', () => {
    parser._options = {...parser._options, ...{typeFileName: 'Test.ts'}};
    assert.strictEqual(parser.fileName, 'Test.ts');
  });

  it('Should set specific type option validate fileName property', () => {
    parser._options = {...parser._options, ...{type: 'Test'}};
    assert.strictEqual(parser.fileName, 'test-type.ts');
  });

  it('Should set output option validate fileName property', () => {
    parser._options = {...parser._options, ...{output: 'output'}};
    assert.strictEqual(parser.fileName.indexOf('output/') > -1, true);
  });

  it('Should get type query', () => {
    assert.strictEqual(!!typeQuery('Patient').query, true);
  });

});

describe('Parser generate type file tests', () => {

  let parser;
  const options = {
    url: 'http://localhost:5000/api',
    output: 'output'
  };

  before(() => {
    rimraf.sync(appRoot.path + '/' + options['output']);
  });

  beforeEach(() => {
    parser = new GqlParser(options);
  });

  it('Should generate specific "object" type file', () => {
    parser._raw = require('./types/object-type.json');
    parser._options =
        {...parser._options, ...{type: 'Address'}};
    parser._generate();
    const contents = fs.readFileSync(appRoot.path +
        '/' + parser._options['output'] + '/address-type.ts', 'utf8');
    assert.strictEqual(contents.indexOf('interface Address') > -1, true);
  });

  it('Should generate specific "input_object" type file', () => {
    parser._raw = require('./types/input-object-type.json');
    parser._options =
        {...parser._options, ...{type: 'Address_Input'}};
    parser._generate();
    const contents = fs.readFileSync(appRoot.path +
        '/' + parser._options['output'] + '/address_input-type.ts', 'utf8');
    assert.strictEqual(contents.indexOf('interface Address_Input') > -1, true);
  });

  it('Should generate specific "enum" type file', () => {
    parser._raw = require('./types/enum.json');
    parser._options =
        {...parser._options, ...{type: 'Gender'}};
    parser._generate();
    const contents = fs.readFileSync(appRoot.path +
        '/' + parser._options['output'] + '/gender-type.ts', 'utf8');
    assert.strictEqual(contents.indexOf('enum Gender') > -1, true);
  });

  it('Should generate specific "array" type file', () => {
    parser._raw = require('./types/list-object-type.json');
    parser._options =
        {...parser._options, ...{type: 'Patient'}};
    parser._generate();
    const contents = fs.readFileSync(appRoot.path +
        '/' + parser._options['output'] + '/patient-type.ts', 'utf8');
    assert.strictEqual(contents.indexOf('Address[]') > -1, true);
  });

  it('Should generate schema type file', () => {
    parser._raw = require('./types/schema.json');
    parser._generate();
    assert.strictEqual(parser instanceof GqlParser, true);
  });

});
