var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var DocumentModel = require('../models/Document');

var documentType = new GraphQLObjectType({
  name: 'document',
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      content: {
        type: GraphQLString
      }
    };
  }
});

var query = new GraphQLObjectType({
  name: 'Query',
  fields: function() {
    return {
      documents: {
        type: new GraphQLList(documentType),
        resolve: function() {
          const documents = DocumentModel.find().exec();
          if (!documents) {
            throw new Error('Error');
          }
          return documents;
        }
      }
    };
  }
});

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function() {
    return {
      addDocument: {
        type: documentType,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function(root, params) {
          const documentModel = new DocumentModel(params);
          const newDocument = documentModel.save();
          if (!newDocument) {
            throw new Error('Error');
          }
          return newDocument;
        }
      },
      updateDocument: {
        type: documentType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return DocumentModel.findByIdAndUpdate(
            params.id,
            { title: params.title, content: params.content },
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      removeDocument: {
        type: documentType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remDocument = DocumentModel.findByIdAndRemove(params.id).exec();
          if (!remDocument) {
            throw new Error('Error');
          }
          return remDocument;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query, mutation });
