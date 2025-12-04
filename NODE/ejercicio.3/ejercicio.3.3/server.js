const http= require('http');
const {URL}= require('url');
const os= require ('os');
const config= require('./config.json');
const diccionario= require ('./diccionario.json');

const palabras= diccionario.palabras;

function getRandomUsername(numPalabras){
    let words=[];    
    for (let i=0; i<numPalabras; ++i){
        const randomIndex= Math.floor(Math.random()*palabras.length);
        words.push(palabras[randomIndex]);
    }
    const randomNum= Math.floor(Math.random()*1000);
    return words.join('-')+randomNum;
};

const server = http.createServer((req,res) =>{
    if (req.method==='GET' && req.url.startsWith('/')){
        const fullUrl = new URL (req.url, `http://${req.headers.host}`);
        const xParam= fullUrl.searchParams.get('x');
        let numPalabras= parseInt(xParam,10);
        if (isNaN(numPalabras)|| numPalabras <=0){
            numPalabras=3;
        }
        const username = getRandomUsername (numPalabras);
        res.statusCode=200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Tu nombre de usuario es: ${username}\n` + 
            `Si quieres cambiar el numero de palabras de ru nombre de usuio pon: /?x= numero que quieras, en ola url de la paguina\n`);
    }else{
        res.statusCode=404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found\n');
    }
});

const PORT= config.PORT || 3000;

server.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})
