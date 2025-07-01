# Event Organizer API

Una aplicación web para organizar eventos, con registro (que permite observar, agregar, modificar, o eliminar eventos ) e inicio de sesión de usuarios.

## Indice
-[Tecnologias y dependencias](#tecnologías-y-dependencias)
-[Dependencias principales](#dependencias-principales)
-[Como correr el servidor](#cómo-correr-el-servidor)
-[Enpoints Principales](#endpoints-principales)
-[Link a la app](#link-a-la-app)

## Tecnologías y dependencias

- **Node.js** y **Express**(se recomienda usar la versión 4.18.2 de Express; versiones más recientes pueden generar problemas con las rutas)
- **TypeScript**
- **bcrypt** (para hashear contraseñas)
- **jsonwebtoken** (para autenticación mediante JWT)
- **dotenv** (para gestionar las variables de entorno)
- **CORS**
- **fs** (módulo nativo de Node.js para manejo de archivos)
- **Frontend:** HTML, CSS, JavaScript

### Dependencias principales

```bash
npm install express bcrypt jsonwebtoken dotenv cors
npm install --save-dev typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken
```

## Cómo correr el servidor

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Crea un archivo `.env` en la raíz de `/backend` con tu clave secreta:**
   ```
   SECRET_KEY=tu_clave_secreta
   ```

3. **Compila TypeScript y ejecuta el servidor:**
   -Asegúrate de estar en la carpeta eventorganizerapi/backend

   ```bash
   npx tsc
   node dist/index.js
   ```
   
---

## Documentación de la API

### Endpoints principales

#### Usuarios

- `POST /users/register`  
  Registra un nuevo usuario.  
  **Body:** 
  `{ 
    "email": "mail", 
    "password": "pass" 
  }`

- `POST /users/login`  
  Inicia sesión y devuelve un token JWT.  
  **Body:** 
  `{ 
    "email": "mail", 
    "password": "pass" 
  }`

#### Eventos

- `GET /events`  
  Devuelve todos los eventos.

- `POST /events`  
  Crea un nuevo evento.  
  **Body:** 
  `{ 
    "name": "Nombre del evento", 
    "place": "Ubicacion", 
    "date": "aaaa-mm-dd", 
    "hour": "hh:mm" 
  }`

- `PATCH /events/:id`  
  Edita un evento existente.

- `DELETE /events/:id`  
  Elimina un evento.
  
## Link a la APP
   [EventOrganizerAPI page](https://m3ada-eventorganizer-3.onrender.com)


-[Volver al inicio](#event-organizer-api)