import express, { Application, Request, Response } from 'express'
import path from 'path'
import eventsRouter from './routes/events-routes'
import authRouter from './routes/auth-routes'
import { errorMiddleware } from './middlewares/error-middleware'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../public')))

app.use('/events', eventsRouter)
app.use('/users', authRouter)


app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

// DEBUG: Mostrar rutas registradas
const listRoutes = (prefix: string, router: any) => {
    router.stack.forEach((layer: any) => {
        if (layer.route && layer.route.path) {
            console.log(`${prefix}${layer.route.path}`);
        }
    });
}

console.log("📋 Rutas en /events:");
listRoutes('/events', eventsRouter);

console.log("📋 Rutas en /users:");
listRoutes('/users', authRouter);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})