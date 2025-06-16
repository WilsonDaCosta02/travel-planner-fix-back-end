const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    nama: String!
    no_hp: String!
    email: String!
    password: String!
    foto: String
  }

  type Query {
    users(id: ID): [User!]!
  }

  type Mutation {
  createUser(nama: String!, no_hp: String, email: String!, password: String!): User!
  updateUser(id: ID!, nama: String, no_hp: String, email: String, password: String, foto: String): User!
  deleteUser(id: ID!): Boolean!
  login(email: String!, password: String!): User
}
`;

module.exports = typeDefs;
