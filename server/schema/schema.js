const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

// dummy data
var books = [
  {name: 'Book 1', genre: 'Fantasy', id: '1', authorId: '1'},
  {name: 'Book 2', genre: 'Fantasy', id: '2', authorId: '2'},
  {name: 'Book 3', genre: 'Sci-Fi', id: '3', authorId: '3'},
  {name: 'Book 4', genre: 'Fantasy', id: '4', authorId: '2'},
  {name: 'Book 5', genre: 'Fantasy', id: '5', authorId: '3'},
  {name: 'Book 6', genre: 'Sci-Fi', id: '6', authorId: '3'}
];

var authors = [
  {name: 'Tom Cheung', age: 44, id: '1'},
  {name: 'Peter Yip', age: 42, id: '2'},
  {name: 'Kelvin Cho', age: 53, id: '3'}
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args){
        return _.find(authors, {id: parent.authorId});
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return _.filter(books, {authorId: parent.id});
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      // id is the argument passed into the query
      // GraphQLID in a query can be int or string
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        // code to get data from db / other source
        return _.find(books, {id: args.id});
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        return _.find(authors, {id: args.id});
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return books
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return authors
      }
    }
  }
});

// {
//   book(id: "1"){
//     name
//     genre
//   }
// }

// {
//   author(id: 2){
//     name
//   }
// }

module.exports = new GraphQLSchema({
  query: RootQuery
})
