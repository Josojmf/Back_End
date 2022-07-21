
import { persona1, amigo1 ,amigo2 } from "./objetosTest";

const tostring = (input : any ) => {
    let ret:string="";
    //Check  if not array or object
    if (!Array.isArray(input) && typeof (input) !== "object") {
        ret += input; //If not array or object, return the value concatenated to itself 
        return ret;
    }
    //Check if array
    else if (Array.isArray(input)) {
        ret += "[";     //Add first bracket of the array
        input.forEach((z: any) => {  //For each element in the array check recursiveley the type of the element and stringify it
            ret += `${tostring(z)},`
        })
        ret = ret.slice(0, ret.length - 1)//We remove the last element due to being a blank space
        ret += "]"//Add last bracket of the array
        return ret;
    }
    //Check if object
    else if (typeof (input== "object")) {
        ret += "{"; //Add first bracket of the object
        Object.keys(input).forEach((k: string) => { //For each key in the object check recursiveley the type of the element
            if (typeof (input[k]) === "object") {  //If the element is an object, stringify it adding the key and the value
                ret += `"${k}":${tostring(input[k])},` //Recursiveley check the contents of the object
            }
            else if (typeof (input[k]) === "string") { //If the element is a string
                ret += `"${k}":"${input[k]}",` //Just add the value without treating it
            }
            else {
                ret += `"${k}":${input[k]},` //For other simple types just add the value without treating it
            }
        });
        ret = ret.slice(0, ret.length - 1) //We remove the last element due to being a blank space
        ret += "}"; //Add last bracket of the object
        return ret;
    }
    return ret;

}

if (tostring(persona1) == JSON.stringify(persona1)) console.log("Ejercicio 1 funciona");