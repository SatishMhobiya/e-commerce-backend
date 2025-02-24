import express from 'express';
import { createPaymentIntent } from '../controllers/payment';

const app = express.Router();

app.post("/create", createPaymentIntent);

export default app;