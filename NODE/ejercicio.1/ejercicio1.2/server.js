const http =require('http');
const os= require('os');
const config= require('./config,json');

function showStartInfo(){
    console.log('---INFO principio---');
    console.log('Version Node', process.version);
    console.log('Sistema Operativo:', os.plataforma(), os.arch());
    console.log('Directorio actual:', process.cwd());
    console.log('-------------------');
}

function printStats(){
    //1. Calcular % de memoria usada
    const mem= process.memoryUsage();
    const memPercent=(mem.heapUsed/mem.heapTotal)*100;

    //2. Numero de CPUs
    const cpuCount= os.cpus().length;

    //3. Crear la marca de tiempo
    const now = new Date();
    const year= now.getFullYear();
    const month= String(now.getMonth()+1).padStart(2,'0'); //en JS enero=0 por eso sumamos 1
    const day = String(now.getDate()).padStart(2, '0');// padStart añade un 0 a la izquierda si es menor de 10
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timetamp= '${year}-${month}-${day} ${hours}:${minutes}:${seconds}';

    //4. Crear la linea de log
    const line=`${timestamp} - MEM: ${memPercent.toFixed(1)}% - CPUS: ${cpuCount}\n`;

    //5. Mostrar por consola
    console.log(line.trim());

    // 6. Añadir la línea al fichero de log indicado en config.logFile
    fs.appendFile(config.logFile, line, (err) => {
        if (err) {
        console.error('Error escribiendo en el log:', err);
        }
    });
}

const server=http.createServer((req,res)=>{//crea un servicio http
    if(req.method==='GET' && req.url==='/'){ 
        res.statusCode=200;
        res.setHeader('Content-Type','text/plain');
        res.end('Todo bien');
    }else if (req.method === 'GET' && req.url === '/last'){
        fs.readFile(config.logFile, 'utf8', (err,data)=> {
            if(err){
                res.statusCode=500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Error leyendo el fichero de log');
            }
            const lines= data.trim().slpit('/n');
            const lastLine= lines[lines.lenght-1] || '';
            
            res.statusCode=200;
            res.setHeader('Content-Type', 'text/palin');
            res.end(lastLine + '/n');
        });
    }else{
        res.statusCode=404;
        res.setHeader('Content-Type', 'text/palin');
        res.end('Not Found');
    }
});

// Arrancamos el servidor
const PORT= config.port || 3000;

server.listen (PORT, ()=>{
    console.log('Servidor escuchando en http://localhost: ${PORT}');
    showStartInfo();
    const intervalMs= (consig. intervalSeconsd || 5)*1000;
    setInterval(printStats, intervalMs);
});
