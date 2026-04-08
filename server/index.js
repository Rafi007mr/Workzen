import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js' 
import settingRouter from './routes/setting.js'
import attendanceRouter from './routes/attendance.js'
import dashboardRouter from './routes/dashboard.js'
import connectToDatabase from './db/db.js'
import mongoose from 'mongoose'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/dashboard', dashboardRouter)

const startServer = async () => {
    try {
        await connectToDatabase()
    } catch (err) {
        console.error('Failed to connect to MongoDB. Exiting.');
        process.exit(1);
    }

    const PORT = parseInt(process.env.PORT, 10) || 5000
    const server = app.listen(PORT, () => {
        console.log(`Server is Running on port ${PORT}`)
    })

    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use.`)
            process.exit(1)
        }
        console.error('Server error:', err)
    })

    const gracefulShutdown = async () => {
        console.log('Shutting down server...')
        server.close(() => {
            console.log('HTTP server closed.')
        })
        try {
            await mongoose.disconnect()
            console.log('MongoDB disconnected.')
        } catch (e) {
            console.error('Error during MongoDB disconnect:', e)
        }
        process.exit(0)
    }

    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)
}

startServer()
