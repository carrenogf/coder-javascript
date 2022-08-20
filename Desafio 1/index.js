alert(" bienvenido, este es el juego del Ahorcado, acontinuación un jugador debe ingresar una palabra sin que el otro la vea, luego el segundo jugador intentará adivinar, tiene 10 intentos!")
let palabra = prompt("ingresa una palabra para jugar o salir para terminar");
// convierto la palabra en minusculas para comparar
palabra = palabra.toLocaleLowerCase();
// defino la variable palabraFormada como un string vacio
let palabraFormada = "";
// bucle while para comprobar que la palabra no esté vacia y no sea salir
let intentos = 10;
while(palabra != "" && palabra != "salir" && palabra != palabraFormada && intentos > 0){
    largo = palabra.length;  

    // llena la palabra con guiones para reemplazarlos luego por la letras que se ingresan
    for(i=0;i<largo;i++){
        palabraFormada += "_";
    }
    
    while(palabra != palabraFormada && intentos > 0){
        let letra = prompt(`Ingresa una letra para formar la palabra ${palabraFormada} tienes ${intentos} intentos`);
        // si no encuentra la letra al final de cada intento restará un intento
        let error = 1;
        for(i=0;i<largo;i++){
            if(letra==palabra[i]){
                // investigue la forma de reemplazar un caracter y me encontré con el metodo substring que corta las cadenas
                // así que simplemente concatenando la primera parte de la palabra con la letra ingresada y el resto logre hacerlo
                palabraFormada = palabraFormada.substring(0,i)+letra+palabraFormada.substring(i+1);
                // cuando encuentra una letra, la variable error se vuelve cero y no restará intentos
                error = 0;
            }
        }
        if(error===1){
            intentos = intentos-1;
        }
    }
}
if(palabra.length > 0  && palabra != "salir"){
    if(intentos==0){
        alert(`Te quedaste sin intentos!, la palabra era ( ${palabra} )`);
    }else{
        // si la palabra tiene caracteres, ya habrá pasado por el proceso anterior, así que al llegar aquí habrá terminado el juego
        alert(`Felicidades, ganaste, la palabra era ( ${palabra} )`);
    }
}
alert("Gracias por participar!");