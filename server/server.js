import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRoute from './routes/user.route.js';
import ownerRoute from './routes/owner.route.js';

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {res.send('Server is running')})
app.use('/api/user', userRoute)
app.use('/api/owner', ownerRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})