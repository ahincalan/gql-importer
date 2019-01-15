module.exports = {
  optionDefinitions: [
    {name: 'verbose', alias: 'v', type: Boolean},
    //   {name: 'src', type: String, multiple: true, defaultOption: true},
    {name: 'url', alias: 'u', type: String},
    {name: 'generate', alias: 'g', type: Boolean},
    {name: 'type', alias: 't', type: String},
    {name: 'typeFileName', alias: 'f', type: String},
    {name: 'output', alias: 'o', type: String},
    {name: 'declarationFile', alias: 'd', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean}
  ],
  helpSections: [
    {
      header: 'GQL Importer',
      content: 'Generates graphql types for typescript interface'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'url',
          typeLabel: '{underline required}',
          description: '(-u) This parameter graphql server url'
        },
        {
          name: 'type',
          typeLabel: '{italic optional}',
          description: '(-t) This parameter for specific type'
        },
        {
          name: 'typeFileName',
          typeLabel: '{italic optional}',
          description: '(-f) This parameter output file name.(default types.ts)'
        },
        {
          name: 'generate',
          typeLabel: '{italic optional}',
          description: '(-g) This parameter with generate typescript file'
        },
        {
          name: 'output',
          typeLabel: '{italic optional}',
          description: '(-o) This parameter output file path'
        },
        {
          name: 'verbose',
          typeLabel: '{italic optional}',
          description: '(-v) This parameter show types console log'
        },
        {
          name: 'declarationFile',
          typeLabel: '{italic optional}',
          description: '(-d) This parameter generate declaration file "d.ts"'
        },
        {
          name: 'help',
          description: '(-h) Print this usage guide.'
        }
      ]
    }
  ]
};

