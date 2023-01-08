import dbConnect from './db.js'
import { server } from './server.js'

dbConnect()
  .then(() => {
    console.log('Database connected c:')

    server.listen(8080, () => {
      console.log('Server listening on port 8080')
    })
  })
  .catch((error) => console.log('Error: ', error))
