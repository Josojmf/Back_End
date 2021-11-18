# BackEnd-2021-2022
Releases de la asignatura Backend/Programacion de Internet

Autores: José María Fernández y Grabriel Sosa Dubuc

API con servidor local que se encarga de sacar los datos de una base de datos tipo MongoDB y posee diferentes funcionalidades.


ENDPOINTS:

getStatus=> GET http://localhost:8000/status         : devuelve 200 OK si el servidor esta operativo

getPosts=> GET http://localhost:8000/all             : devuelve por pantalla en el navegador todos los datos de la base de datos seleccionada

getPost=> GET   http://localhost:8000/id             : devuelve por pantalla en el navegador el post seleccionado con el ide proporcionado en la barra de busquedas del navegador a esta funcion hay que llamarla dos veces, una introduciendo el comando http://localhost:8000/ y el id en la barra de busqueda
                                                       y una segunda vez actualizando la página (tecla F5)                                            

switchstatus=>PUT http://switchstatus:8000/id        : devuelve un mensaje de switced por pantalla del navegador, se encarga de cambiar el estado del personaje 

dentro de la base de datos esta funcion no esta completa y funciona de manera dispar en funcion del estado que tenga el dato a modificar, si el estado es "Alive"
                                                       habra que hacer 3 peticiones PUT para que se modifique el estado a "Dead", si es el caso contrario entonces 
                                                       habra que hacer solo 2 peticiones PUT


deletePost=> DELETE http://localhost:8000/chracter/id: devuelve un mensaje de confirmacion por la pantalla del navegador si se ha conseguido borrar el dato seleccionado por medio de la barra de busqueda del navegador.                                        
