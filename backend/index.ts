import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import messageRoutes from './src/routes/message.routes.js';

const app = express();
config();

app.use(express.json());
app.use(cookieParser()); //for parsing cookies


app.get('/', (req, res) => {
    res.send('Hello World!');
  });
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

 

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

//add socket.io here
//configure this server for the deployment