import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'

import bodyParser from 'body-parser'
import cors from 'cors'
import { Server as HttpServer } from 'http'
// import { Server as IOServer } from 'socket.io'

//import { errorHandle } from '#middlewares/index.js'

const app = express()
const httpServer = new HttpServer(app)
const schema = makeExecutableSchema({ typeDefs, resolvers })

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const wsServerCleanup = useServer({ schema }, wsServer)

const serverApollo = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart () {
        return {
          async drainServer () {
            await wsServerCleanup.dispose()
          }
        }
      }
    }
  ]
})
await serverApollo.start()

// socket
// const httpServer = new HttpServer(app)
// const io = new IOServer(httpServer, {
//   cors: true,
//   origins: ['*']
// })

// config
// middlewares
app.use(express.json())
app.use(cors())

// routers
app.get('/', (request, response) => {
  response.json({
    description: 'Api - Landrada Desarrollos',
    version: '1.0.0',
    developed: [
      {
        name: 'DevKoore',
        userGit: '@devKoore'
      }
    ]
  })
})

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(serverApollo, {
    // context: async ({ req }) => ({ token: req.headers.token })
    context: async ({ req }) => ({ req })
  })
)

// handleError
//app.use(errorHandle)

export {
  httpServer
}
