import { gql } from "apollo-server-express"

const typeDefs = gql`
    type Message {
        text: String
        createdBy: String
    }

    input MessageInput {
        text: String 
        username: String
    }

    type Query{
        message(id: ID!):Message
    }

    type Mutation {
        createMessage(messageInput: MessageInput): Message!
    }

    type Subscription {
        messageCreated: Message
    }
`

export {
    typeDefs
  }