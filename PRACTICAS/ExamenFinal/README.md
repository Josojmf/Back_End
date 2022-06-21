# Examen Final Backend 2022
## Install:
npm install
### Endpoints :
listMatches : Devolverá un array con todos los partidos en juego (no finalizados).Si no hay partidos en juego devolverá un array vacío.  

getMatch : Devolverá un partido, con todos sus datos, independientemente de que esté finalizado o no. Si no existe un partido con dicho id devolverá un error 404.  

subscribeMatch : Permitirá suscribirse a un partido que esté en juego, de modo que cada vez que cambie el resultado o cuando finalice el partido me llegará a través de la suscripción los datos del partido. Si no existe un partido con dicho id devolverá un error 404.  

setMatchData : Actualiza los datos de un partido (el nombre de los equipos no se puede actualizar). Debe comprobar que los datos son coherentes (en caso contrario devolverá un error442):  
○ La puntuación de ninguno de los 2 equipos es menor que la puntuación anterior.  
○ Los minutos transcurridos son mayores que los minutos anteriores.
○ Si el partido ya había finalizado no permite modificar ningún dato.
● Si no existe un partido con dicho id devolverá un error 404. 

startMatch :  Crea un nuevo partido, poniendo el resultado a “0-0” y el minuto a 0. Debe comprobar que no existe ningún partido en curso con el mismo nombre de equipos (aunque estén en distinto orden). En caso contrario devolverá un error 442  

### Variables de entorno :
#### Para que el programa funcione se tiene que icluir en la carpeta fuente un archivo .env con la siguiente estructura:

PORT = Puerto del servidor
DB_USER = Usuario de la base de datos MongoDb 
DB_PASSWORD = Contraseña de la base de datos MongoDb
DB_CLUSTER = Cluster de la base de datos MongoDb (entre el @ y la /)


