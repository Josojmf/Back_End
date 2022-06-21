# API para un sistema de chat
## Install:
npm install
### Endpoints :
Signin - permite a un usuario registrarse @params : email, password  
Signout - permite darse de baja @params requiere el token de sesion por los headers  
Login - permite iniciar sesión @params : email,password  
Logout - permite cerrar sesión  @params requiere el token de sesion por los headers  
getChats - me devuelve un array con todas las salas de chats que hay abiertas  @params requiere el token de sesion por los headers  
postCreated - permite unirse a una sala de chat @params nombre chat, token de sesion(esta vez por parámetros del campo)  
quit - permite abandonar el chat en el que estoy unido @params requiere el token de sesion por los headers  
createPost - envía un mensaje a la sala de chat a la que estoy unido. @params usuario, mensaje requiere el token de sesion por los headers  

### Variables de entorno :
#### Para que el programa funcione se tiene que icluir en la carpeta fuente un archivo .env con la siguiente estructura:

PORT = Puerto en el que se alojará el servidor  
MONGO_DATABASE = Nombre de la base de datos  
TOKEN = Token de sesion (se requerirá una vez se haya iniciado sesión)  
AUTHOR = No es necesario  
DB_URL = mongodb+srv://USERNAME:PASSWORD@cluster0.6xzff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority  URL de la base de datos de MongoDb  

### Conclusiones y Fallos :
No se ha conseguido que el flujo de información privilegiada se haga mediente las variables de entorno, para que el programa funcione correctamente una vez se haya creado un usuario y se haya iniciado sesión se tiene que pegar el token de sesion en el campo TOKEN del archivo .env

El endopint de quit no está totalmente funcional, ya que solo impide mandar mensajes al chat que se está unido, pero se siguen recibiendo mensajes a no ser que se cancele la escucha del servidor de subscripciones.

El formato del contenido de la DDBB es:  
 Usuario{  
            _id:  
            email:  
            password:  
            token:  
            chat:  
 }
