import { httpServer } from './server.js'
import dbConnect from './db.js'

dbConnect()
  .then(() => {
    console.log('Database connected')
    httpServer.listen(8000, () => {
      console.log('🚀 Server ready at http://localhost:8000/graphql')
    })
  })
  .catch((error) => console.log('Error: ', error))
