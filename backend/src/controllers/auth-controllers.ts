//--------------------------Controladores para el registro y log in del usuario
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Me salia un error de tipo al querer usar .user mas abajo, asi que le extiendo la propiedad user a Request de tipo any
interface AuthRequest extends Request {
    user?: any
}

const dataBasePath = path.join(process.cwd(), 'src', 'database', 'users.json')//No use  __dirname,porque me salia un error al momento de compilar, entonces con process.cwd() me aseguro que empiece si o si desde la raiz del proyecto, y que pase por las carpetas que menciono despues hasta llegar al archivo
const SECRET_KEY = process.env.SECRET_KEY || 'belu'


export const registerUser = async (req: Request, res: Response) => {
    //Separamos el cuerpo de la solicitud http en email y password. Chequeamos que no esten vacios los campos
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' })
        return
    }
    //chequeamos si ya existia
    const database = JSON.parse(fs.readFileSync(dataBasePath, 'utf-8'))
    const userExists = database.find((user: any) => user.email === email)
    if (userExists) {
        res.status(400).json({ error: 'The user provided is already registered' })
        return
    }
    //Hashteamos la contraseña, no podemos seguir hasta que la obtengamos
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { id: Date.now(), email, password: hashedPassword }
    database.push(newUser)

    //Si todo sale bien, sobreescribe el archivo users.json agregando al nuevo usuario
    fs.writeFileSync(dataBasePath, JSON.stringify(database, null, 2))
    res.status(201).json({ message: 'User registered successfully' })
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' })
        return
    }
    //Si al leer ntra base de datos, no encuentra al user pasado, indica usuario no encontrado
    const database = JSON.parse(fs.readFileSync(dataBasePath, 'utf-8'))
    const user = database.find((user: any) => user.email === email)
    if (!user) {
        res.status(400).json({ error: 'User not found' })
        return
    }
    //Comparamos la contraseña dada con la guardada en ntra base de datos. Si no coincide, indica el error de no autorizado
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        res.status(401).json({ error: 'Incorrect password' })
        return 
    }

    //Si la contraseña es correcta, genera el token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' })
    res.json({ message: 'Session started successfully.', token })
}

export const getProfile = (req: AuthRequest, res: Response) => {
    res.json({ message: `Welcome ${req.user.email}`, user: req.user })//uso la propiedad user que extendi de req
}