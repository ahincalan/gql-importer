module.exports = {
  schemaQuery: {
    'query': `query {   
      __schema{    
        types {
          name,
          kind,
          enumValues {
            name
            description            
          },
          fields {
            name
            type {
              kind
              name  
              ofType {
                name
                kind
                ofType{
                  name
                  kind
                }
              }         
            }
          }
          inputFields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType{
                  name
                  kind
                }
              }   
            }
          }
        }
      }
    }`
  },
  typeQuery: (type) => {
    return {
      'query': `query {   
        __type(name:"${type}") {
          kind
          enumValues {
            name
            description            
          }
          fields {
            name                            
            type {
              name
              kind,
              ofType {
                name
                kind
                ofType{
                  name
                  kind
                }
              }                     
            }
          }
          inputFields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType{
                  name
                  kind
                }
              }   
            }
          }
        } 
      }`
    };
  }
};
