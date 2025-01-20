import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import router from './src/Routers/index.js';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(express.json());

app.listen(3000);
app.use(cors({
 origin: 'http://localhost:5173',
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
 credentials: false
}));
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

const limiter = rateLimit({
 max: 100,
 windowMs: 60 * 60 * 1000, // 1 hour
 message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);
app.use('/api',router)

export { app };