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

  type Trip {
    id: ID!
    user_id: ID!
    title: String!
    location: String!
    remarks: String
    start_date: String!
    end_date: String!
  }

  type H3Notif {
  user_id: ID!
  nama: String!
  location: String!
  title: String!
  }

  type DreamDestination {
  id: ID!
    user_id: ID!
    name: String!
    image: String!
  }

  type Query {
    users(id: ID): [User!]!
    trips(user_id: ID!): [Trip!]!
    dreamDestinations(user_id: ID!): [DreamDestination!]!
  }

  type Mutation {
    createUser(
      nama: String!
      no_hp: String
      email: String!
      password: String!
    ): User!

    updateUser(
    id: ID!
      nama: String
      no_hp: String
      email: String
      password: String
      foto: String
    ): User!
    
    deleteUser(id: ID!): Boolean!

    login(email: String!, password: String!): User

    forgotPassword(email: String!): String!

    resetPassword(email: String!, password: String!): String!


    createTrip(
      user_id: ID!
      title: String!
      location: String!
      remarks: String
      start_date: String!
      end_date: String!
    ): Trip!

    updateTrip(
      id: ID!
      title: String
      location: String
      remarks: String
      start_date: String
      end_date: String
    ): Trip!

    deleteTrip(id: ID!): Boolean!

    createDreamDestination(
    user_id: ID!
    name: String! 
    image: String!): DreamDestination!

    updateDreamDestination(
    id: ID!
    name: String
    image: String): DreamDestination!
    
    deleteDreamDestination(
    id: ID!): Boolean!

    triggerTestNotifH3: [H3Notif!]!
  }
`;

module.exports = typeDefs;
