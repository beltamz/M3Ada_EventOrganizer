import express, { Application, Request, Response } from 'express'
import path from 'path'
import eventsRouter from './routes/events-routes'
import authRouter from './routes/auth-routes'
import { errorMiddleware } from './middlewares/error-middleware'
import dotenv from 'dotenv'

dotenv.config();//cargamos nuestra variable de entorno

const app: Application = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../public')));

//Endpoints general para eventos y usuarios
app.use('/events', eventsRouter);
app.use('/users', authRouter);
//El servidor muestra siempre esta pagina princial al utilizar la pagina
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})