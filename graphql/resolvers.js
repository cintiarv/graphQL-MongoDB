import { Message } from "../models/message.js"
import { PubSub } from "graphql-subscriptions"

const pubSub = new PubSub()

const resolvers = {
    Mutation: {
        async createMessage(_, {messageInput: {text, username}}){
            const newMessage = new Message({
                text:text,
                createdBy: username
            })
            const res = await newMessage.save()

            pubSub.publish('MSG_CREATED', {
                messageCreated: {
                    text: text,
                    createdBy: username
                }
            })

            return{
                id:res.id,
                ...res._doc
            }
        }
    },
    
    Query: {
        message:(_, {ID})=> Message.findById(ID)
    },

    Subscription: {
        messageCreated: {
            subscribe: () => pubSub.asyncIterator('MSG_CREATED')
        }
    }
}

export {
    resolvers
  }