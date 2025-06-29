import { Request, Response } from "express";

import{EventsModel} from '../models/events-models'

//controlador para obtener todos los eventos
export const getAllEvents= (req: Request,res: Response): void=>{
    const events = EventsModel.getAllEvents();//metodo dentro del modelo
    res.json(events)
}

//controlador para crear un evento
export const createEvent= (req: Request,res: Response): void=>{
    const newEvent = EventsModel.addEvent(req.body)//metodo en el modelo
    res.status(201).json(newEvent)
}

//controlador para actualizar un evento
export const updateEvent= (req: Request,res: Response): void=>{
    const {id} = req.params
    const updatedEvent= EventsModel.updateEvent(id, req.body)//metodo en el modelo
    if(!updatedEvent){
        res.status(404).json({error:'Event not found'})
        return
    }
    res.json(updatedEvent)
}
    
//controlador para eliminar un evento
export const deleteEvent= (req: Request,res: Response): void=>{
    const {id} = req.params
    const isDeleted= EventsModel.deleteEvent(id)
    if(!isDeleted){
        res.status(404).json({error: "Event couldn't be deleted: It was not found"})
        return
    }
    res.status(204).send()
}