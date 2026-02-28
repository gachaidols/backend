import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import publicRoutes from './routes/public.route.js';
import privateRoutes from './routes/private.route.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', publicRoutes);
app.use('/api/private', privateRoutes);

app.get('/', (req, res) => {
  res.json({ status: "ok", code: 200, message: 'Server is running' });
});

export default app;