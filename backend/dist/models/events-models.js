"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '../database/events.json'); //conecto con mi base de datos Json
//Metodos que estan dentro de los controladores
class EventsModel {
    static getAllEvents() {
        const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8')); //lee el contenido y lo convierte a JS
        return data.events;
    }
    static addEvent(newEvent) {
        const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        const newId = (data.events.length + 1).toString(); //newId considerando la longitud del array
        const event = Object.assign(Object.assign({}, newEvent), { id: newId }); //Crea un evento con los datos pasados + el nuevo Id
        data.events.push(event);
        data.info.total += 1; //incremento el contador de mi archivo events.json
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2)); //Guardo los cambios realizados
        return event;
    }
    static updateEvent(id, updatedData) {
        const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        const index = data.events.findIndex((event) => event.id === id); //Busca el indice coincidente
        if (index === -1)
            return null;
        data.events[index] = Object.assign(Object.assign({}, data.events[index]), updatedData);
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return data.events[index];
    }
    static deleteEvent(id) {
        const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        const index = data.events.findIndex((event) => event.id === id);
        if (index === -1)
            return false;
        data.events.splice(index, 1);
        data.info.total -= 1;
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    }
}
exports.EventsModel = EventsModel;
