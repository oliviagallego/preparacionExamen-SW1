const http= require('http');
const os= require('os');
const config= require('./config.json');

const diccionario= require('./diccionario.json');
const palabras= diccionario.palabras;//El array de palabras está dentro de diccionario.palabras

function getRandomPassword(numbWords){
    let password= [];
    for (let i=0; i<numbWords; i++){
        const randomIndex= Math.floor(Math.random()* palabras.length);
        password.push(palabras[randomIndex]);
    }
    return password.join('-');
}


const server = http.createServer((req,res)=>{
    if (req.method === 'GET' && req.url.startsWith('/')){
        const fullUrl = new URL (req.url, `http://${req.headers.host}`);
        const xParm = fullUrl.searchParams.get('x');
        let numWords= pardeInt (xParam,10);
        if (isNaN (numWords) || numWords <=0){
            numword = 3;
    }
    const password= getRandomPassword(numWords);

    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Tu contraseña aleatoria es: ${password}\n');

    }else{
        res.statusCode= 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found\n');
    }
});

const PORT= config.PORT ||3000;

server.listen(PORT, ()=>{
    console.log('Servidor escuchando en http://localhost:${PORT}');
});