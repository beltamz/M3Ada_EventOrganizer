"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getAllEvents = void 0;
const events_models_1 = require("../models/events-models");
//controlador para obtener todos los eventos
const getAllEvents = (req, res) => {
    const events = events_models_1.EventsModel.getAllEvents(); //metodo dentro del modelo
    res.json(events);
};
exports.getAllEvents = getAllEvents;
//controlador para crear un evento
const createEvent = (req, res) => {
    const newEvent = events_models_1.EventsModel.addEvent(req.body); //metodo en el modelo
    res.status(201).json(newEvent);
};
exports.createEvent = createEvent;
//controlador para actualizar un evento
const updateEvent = (req, res) => {
    const { id } = req.params;
    const updatedEvent = events_models_1.EventsModel.updateEvent(id, req.body); //metodo en el modelo
    if (!updatedEvent) {
        res.status(404).json({ error: 'Event not found' });
        return;
    }
    res.json(updatedEvent);
};
exports.updateEvent = updateEvent;
//controlador para eliminar un evento
const deleteEvent = (req, res) => {
    const { id } = req.params;
    const isDeleted = events_models_1.EventsModel.deleteEvent(id);
    if (!isDeleted) {
        res.status(404).json({ error: "Event couldn't be deleted: It was not found" });
        return;
    }
    res.status(204).send();
};
exports.deleteEvent = deleteEvent;
