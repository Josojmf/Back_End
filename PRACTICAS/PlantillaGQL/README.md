# Plantilla para pryectos GraphQl
## Install:
npm install
### Endpoints :
Signin - permite a un usuario registrarse @params : email, password  
Signout - permite darse de baja @params requiere el token de sesion por los headers  
Login - permite iniciar sesión @params : email,password  
Logout - permite cerrar sesión  @params requiere el token de sesion por los headers  

### Variables de entorno :
#### Para que el programa funcione se tiene que icluir en la carpeta fuente un archivo .env con la siguiente estructura:


PORT = Puerto del servidor
DB_USER = Usuario de la base de datos MongoDb 
DB_PASSWORD = Contraseña de la base de datos MongoDb
DB_CLUSTER = Cluster de la base de datos MongoDb (entre el @ y la /)


