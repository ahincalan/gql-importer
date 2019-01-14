const request = require('request-promise-native');
const chalk = require('chalk');
const {schemaQuery, typeQuery} = require('./query');
const fs = require('fs');

class Parser {

  constructor(options) {
    this._options = options;
    this._send = request;
    this._raw = null;
    this._fileName = 'default.ts';
    this._types = {};
  }

  get fileName() {
    if (this._options['typeFileName']) {
      this._fileName = this._options['typeFileName'];
    } else {
      if (this._options['type'])
        this._fileName = this._options['type'].toLowerCase() + '-type.ts';
      else
        this._fileName = 'schema-types.ts';
    }
    if (this._options['output']) {
      try {
        fs.statSync(this._options['output']);
      } catch (e) {
        /*istanbul ignore next*/
        fs.mkdirSync(this._options['output']);
      }
      this._fileName = this._options['output'] + '/' + this._fileName;
    }
    return this._fileName;
  }

  get fileContent() {
    let fields;
    if (this._options['type']) {
      fields = this._raw.data['__type']['fields'] ||
          this._raw.data['__type']['inputFields'] ||
          this._raw.data['__type']['enumValues'];
      return this._typeParser(this._options['type'], fields, this._raw.data['__type'].kind);
    } else {
      return this._schemaParser(this._raw.data['__schema'].types);
    }
  }

  /*istanbul ignore next*/
  _getGqlObject(type) {
    this._raw = null;
    const params = {
      uri: this._options['url'],
      method: 'POST',
      json: (type ? typeQuery(type) : schemaQuery)
    };
    this._send(params).then((data) => {
      this._raw = data;
      if (this._options['verbose'])
        console.log(data);
      if (this._options['generate']) {
        this._generate();
      }
    }).catch((error) => {
      console.error(chalk['red'](error));
    });
  }

  /*istanbul ignore next*/
  getSchema() {
    this._getGqlObject();
  }

  /*istanbul ignore next*/
  getType(type) {
    this._getGqlObject(type);
  }

  _generate() {
    try {
      fs.writeFileSync(this.fileName, this.fileContent, 'utf8');
    } catch (err) {
      /*istanbul ignore next*/
      console.error(chalk['red'](err.toString()));
    }
  }

  _getFieldType(type) {
    const currentTypes = ['int', 'float', 'string', 'boolean', 'date'];
    let t;
    const k = type.kind;
    const cont = (name, kind) => {
      let tn = name.toLowerCase();
      if (currentTypes.indexOf(tn) < 0 && kind === 'SCALAR') {
        tn = 'string';
      } else {
        if (['int', 'float'].indexOf(tn) > -1) {
          tn = 'number';
        } else if (tn === 'date') {
          tn = name;
        } else if (this._types[name] && !this._options['type']) {
          tn = name;
        } else if (['INPUT_OBJECT', 'ENUM', 'OBJECT'].indexOf(kind) > -1) {
          tn = name;
        } else {
          tn = 'string';
        }
      }
      return tn;
    };

    if (k === 'SCALAR') {
      t = cont(type.name, k);
    } else if (k === 'LIST') {
      if (type['ofType'] && type['ofType']['name']) {
        t = cont(type['ofType']['name'], type['ofType']['kind']);
      } else if (!type['ofType']['name'] && type['ofType']['ofType']) {
        t = cont(type['ofType']['ofType'].name, type['ofType']['ofType'].kind);
      }
    } else if (k === 'NON_NULL') {
      t = cont(type['ofType']['name'], type['ofType']['kind']);
    } else {
      t = type.name;
    }
    return t;
  }

  _typeParser(type, fields, kind) {
    let f = '';
    let k = (kind === 'ENUM' ? 'enum' : 'interface');
    for (const i in fields) {
      if (fields.hasOwnProperty(i)) {
        if (kind === 'ENUM') {
          f += '\n\t' + fields[i].name + ' = "' +
              (fields[i].description || fields[i].name) + '",';
        } else {
          if (['SCALAR', 'OBJECT', 'ENUM',
            'LIST', 'INPUT_OBJECT',
            'NON_NULL'].indexOf(fields[i].type['kind']) > -1) {
            f += '\n\t' + fields[i].name + ' : ' +
                this._getFieldType(fields[i].type) +
                (fields[i].type['kind'] === 'LIST' ? '[]' : '') + ';';
          }
        }
      }
    }
    type = type || this._options['type'];
    return 'export ' + k + ' ' + type + ' {' + f + '\n}';
  }

  _schemaParser(types) {
    let str = '';
    for (const i in types) {
      if (types.hasOwnProperty(i)) {
        if (types[i].name.indexOf('__') !== 0 && types[i].kind !== 'SCALAR') {
          this._types[types[i].name] = types[i];
        }
      }
    }
    for (let key in this._types) {
      if (this._types.hasOwnProperty(key)) {
        if (this._types[key].kind === 'INPUT_OBJECT') {
          str +=
              '\n\n' +
              this._typeParser(this._types[key].name, this._types[key]['inputFields'], this._types[key].kind);
        } else if (this._types[key].kind === 'ENUM') {
          str +=
              '\n\n' +
              this._typeParser(this._types[key].name, this._types[key]['enumValues'], this._types[key].kind);
        } else {
          str += '\n\n' +
              this._typeParser(this._types[key].name, this._types[key]['fields'], this._types[key].kind);
        }
      }
    }
    return str;
  }

}

module.exports = {
  GqlParser: Parser
};
