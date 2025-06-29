import fs from 'fs'
import path from 'path'

const filePath= path.join(process.cwd(), 'src', 'database', 'events.json')//conecto con mi base de datos Json

interface Event{
    id : string,
    name: string,
    place: string,
    date: string,
    hour:string
}


//Metodos que estan dentro de los controladores
export class EventsModel{
     static getAllEvents():  Event[]{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'))//lee el contenido y lo convierte a JS
        return data.events
    }

    static addEvent(newEvent: Event): Event{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const newId= (data.events.length + 1).toString(); //newId considerando la longitud del array
        const event= {...newEvent, id: newId}//Crea un evento con los datos pasados + el nuevo Id
        data.events.push(event);
        data.info.total+=1;//incremento el contador de mi archivo events.json
        fs.writeFileSync(filePath, JSON.stringify(data,null,2));//Guardo los cambios realizados
        return event
    }

    static updateEvent(id:string, updatedData: Partial<Event>): Event | null{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const index= data.events.findIndex((event: Event)=> event.id ===id)//Busca el indice coincidente
        if(index===-1)return null
        data.events[index]= { ...data.events[index],...updatedData}
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        return data.events[index]
    }

    static deleteEvent(id:string):  boolean{
        const data= JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const index= data.events.findIndex((event: Event)=> event.id ===id)
        if(index===-1)return false
        data.events.splice(index, 1)
        data.info.total-=1
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        return true
    }
}