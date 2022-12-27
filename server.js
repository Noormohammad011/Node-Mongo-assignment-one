
import express from 'express'
import colors from 'colors'
import cors from 'cors'
import dotenv from 'dotenv'

//import routes
import userRoutes from './routes/userRoutes.js'


//import middleware
import morgan from 'morgan'


//express configuration
const app = express()
dotenv.config()
//morgan
app.use(morgan('dev'))


// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Enable cors
app.use(cors())





//mount routers
app.use('/user', userRoutes)


const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold
  )
)