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
