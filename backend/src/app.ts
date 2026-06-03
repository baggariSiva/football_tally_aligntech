import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import swaggerDocument from './swagger.json';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Football Tally Backend API!' });
});

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', router);

export default app;
