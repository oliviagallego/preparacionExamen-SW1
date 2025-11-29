//1- Imports y cinfiguraciones
const http= require('http');
const os = require('os');
const config= require('./config.json');
//const config=require('./config.js');
//require('dotenv').config();
/*const config={
    port: Numbre(process.env.PORT)||3000,
    intervalSeconds: Number(process.env.INTERVAL_SECONDS)||5,
    ShowCpu= process.env.SHOW_CPU==='true';
    showNodeOsUpTime: process.env.SHOW_OS_UPTIME==='true',
    showNodeUptime: process.env.SHOW_NODE_UPTIME==='true',
    showMemory: process.env.SHOW_MEMORY==='true'
}*/

//2- Funcion de ayuda
function showStartupInfo(){
    console.log('---INFO AL ARRANCAR---');
    console.log('Version de Node:', process.version);
    console.log('Sistema operativo:', os.plataform(), os.release(), os.arch());//sistema, version y aqruitectura
    console.log('Memoria total: ',os.totalmenory());
    console.log('CPUs: ', os.cpus().lenght);
    console.log('---------------------');
}

//3- Lo que se muestra en cada segundo. Es una funcion que se muestra periodicamente 
function printStats(){
    console.log('---Estadistica---');
    if (config.showCpu){
        const load=os.loadavg();
        console.log(`Load Average (1,5,15 min): ${load[0].toFixed(2)}, ${load[1].toFixed(2)}, ${load[2].toFixed(2)}`);
    }
    if(config.showMemory){
        const memo=process.memoryUsage();
        console.log('Memoria usada: ${(memo.helpdUsed/1024/1024).toFixed(2)} MB');
    }
    if(config.showOsUptime){
        console.log('Tiempo de actividad del sistema operativo: ${os.uptime()} segundos');
    }
    console.log('------------------');
}

//4- Crear el servidor HTTP
const server= http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.end('Todo bien');
});

//5- Arrancar el servidor
const PORT = config.port ||3000;
server.listen(PORT, ()=>{
    console.log('Servidor escuchando en http://localhost:${PORT}');
    showStartupInfo();
    //6- Lanzar el temporizador para mostrar las estadisticas
    const intervalMs= (config.intervalSeconds ||5)*1000;
    setInterval (printStats, intervalMs);
});

