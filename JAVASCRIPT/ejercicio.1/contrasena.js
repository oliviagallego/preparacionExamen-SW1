/* Esto solo se usa en node:
var html = require("html");
var diccionario = require("./diccionario.json");
*/

let palabras=  [
        "árbol",
        "casa",
        "perro",
        "gato",
        "libro",
        "cielo",
        "mar",
        "montaña",
        "río",
        "flor",
        "sol",
        "luna",
        "estrella",
        "nube",
        "viento",
        "fuego",
        "tierra",
        "agua",
        "bosque",
        "ciudad"
    ];

function generarContrasena(numero){
    let password=[];
    for(let i=0; i<numero; i++){
        const aleatorio = Math.floor(Math.random()* palabras.length);
        const word= palabras[aleatorio];
        password.push(word);
    };
    return password.join("");
};

function bottonClick(){
    const input =document.getElementById("numWords");
    const result = document.getElementById("result");

    let n= Number(input.value);

    if (isNaN(n) || n < 1 || n > 10) {
        alert("Por favor, introduce un número entre 1 y 10.");
        return;
    }

    const password = generarContrasena(n);
    result.textContent = "La contraseña generada es: " + password;

}

// Conectamos el botón con la función
const btn = document.getElementById("btnGenerar");
btn.addEventListener("click", bottonClick); 



