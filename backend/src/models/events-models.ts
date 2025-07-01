import fs from 'fs'
import path from 'path'
//Uso process.cwd() nuevamente para no tener problemas con la ruta
const filePath= path.join(process.cwd(), 'src', 'database', 'events.json')

interface Event{
    id : string,
    name: string,
    place: string,
    date: string,
    hour:string
}

//Metodos que estan dentro de los controladores
export class EventsModel{
    //Obtengo los eventos
     static getAllEvents():  Event[]{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'));//lee el contenido y lo convierte a JS
        return data.events
    }
    //Agrego un evento
    static addEvent(newEvent: Event): Event{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const newId= (data.events.length + 1).toString(); //newId basado en la longitud del array
        const event= {...newEvent, id: newId};//Crea un evento con los datos pasados + el nuevo Id
        data.events.push(event);
        data.info.total+=1;//incremento el contador de mi archivo events.json
        fs.writeFileSync(filePath, JSON.stringify(data,null,2));//Escribo la base de datos con el nuevo evento
        return event
    }
    //Actualizo un evento
    static updateEvent(id:string, updatedData: Partial<Event>): Event | null{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const index= data.events.findIndex((event: Event)=> event.id ===id);//Busca el indice coincidente
        if(index===-1)return null;
        data.events[index]= { ...data.events[index],...updatedData};
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return data.events[index]
    }
    //Elimino un evento
    static deleteEvent(id:string):  boolean{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const index= data.events.findIndex((event: Event)=> event.id ===id);
        if(index===-1)return false;
        data.events.splice(index, 1);
        data.info.total-=1 ;//Resto un valor al contador de mi archivo event.json
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        return true
    }
}