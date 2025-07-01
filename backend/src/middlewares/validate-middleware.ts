import express, {Request, Response, NextFunction} from 'express'

//Validamos cada valor pasado de cada evento
export const validateEvent=(req:Request, res: Response, next:NextFunction): void=>{
    const {name, place, date, hour}= req.body
    if(!name || typeof name !=='string'){
        res.status(400).json({error: "Field 'name' is required. It must be a string type"})
        return
    }
    if(!place || typeof place !=='string'){
        res.status(400).json({error: "Field 'place' is required. It must be a string type"})
        return
    }
    if(!date || typeof date !== 'string'){
        res.status(400).json({error: "Field 'date' is required. It must be a string type"})
        return
    }
    if(!hour || typeof hour !== 'string'){
        res.status(400).json({error: "Field 'hour'  is required. It must be a string type"})
        return
    }
    next()
}