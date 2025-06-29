import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


/*import path from 'path'
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
*/

//Me salia un error al queres usar .user, asi que le extiendo la propiedad user a Request
interface AuthRequest extends Request {
    user?: any
}

const dataBasePath = path.join(process.cwd(), 'backend', 'src', 'database', 'users.json')
const SECRET_KEY = process.env.SECRET_KEY || 'belu'

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' })
        return
    }

    const database = JSON.parse(fs.readFileSync(dataBasePath, 'utf-8'))
    const userExists = database.find((user: any) => user.email === email)

    if (userExists) {
        res.status(400).json({ error: 'The user provided is already registered' })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { id: Date.now(), email, password: hashedPassword }
    database.push(newUser)

    fs.writeFileSync(dataBasePath, JSON.stringify(database, null, 2))
    res.status(201).json({ message: 'User registered successfully' })
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ error: 'The user didnt complete one or both field(s)' })
        return
    }
    const database = JSON.parse(fs.readFileSync(dataBasePath, 'utf-8'))
    const user = database.find((user: any) => user.email === email)
    if (!user) {
        res.status(400).json({ error: 'User not found' })
        return
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        res.status(401).json({ error: 'Incorrect password' })
        return 
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' })
    res.json({ message: 'Session started successfully.', token })
}

export const getProfile = (req: AuthRequest, res: Response) => {//uso la propiedad extendida user
    res.json({ message: `Welcome ${req.user.email}`, user: req.user })
}