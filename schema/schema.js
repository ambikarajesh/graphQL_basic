const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql');
const axios = require('axios');
const _ = require('lodash');

const CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:()=>({
        id:{
            type:GraphQLString
        },
        name:{
            type:GraphQLString
        },
        desc:{
            type:GraphQLString
        },
        user:{
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res=> res.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{
            type:GraphQLString
        },
        firstName:{
            type:GraphQLString
        },
        age:{
            type:GraphQLInt
        },
        company:{
            type:CompanyType,
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res=> res.data)
            }
        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name:'RootQuery',
    fields:{
        user:{
            type:UserType,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parentValue, args){
                return axios(`http://localhost:3000/users/${args.id}`).then(res=> res.data)
            }
        },
        company:{
            type:CompanyType,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parentValue, args){
                return axios(`http://localhost:3000/companies/${args.id}`).then(res=> res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQueryType
})