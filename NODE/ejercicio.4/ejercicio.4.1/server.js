const http= require('http');
const https= require('https');
const {URL}= require('url');
const cheerio= require('cheerio');
const config= require('./config.json');

const PORT= consfig.PORT || 3000;
const intervalo_ms= config.intervalo_ms || 1000;
const scaperingUrl= config.caperingUrl || `https://elpais.com`;

let ultimoTitulo = [];

function hacerScarpering(){
    console.log('Haciendo sacpering de la web: ${scaperingUrl}');

    https.get(scaperingUrl, (res) =>{
        let html='';
        res.on('data',chunk =>{
            html += chunk;
        });
        res.on('end', ()=>{
            const $=cheerio.load(html);

            const encontramos=[];

            $('h1').each((i, elem) =>{
                if(encontramos.length <5){
                    return;
                };
                
                const titulo= $(elem).text().trim();

                if(titulo){
                    encontramos.push(titulo);
                };
            });
            
            if(encontramos.length ===0){
                console.warn('No se encontraron titulos h1 en la pagina');
            };            

            ultimoTitulo= encontramos;
            const timestamp= new Date().getTime();

            console.log('Scarping completado a las ${timestamp}:');
            console.log('Titulos h1: ${ultimoTitulo.join('-')}');
        }).on('error', (err) => {
            console.error('Error al hacer scarping', err.message);
        });

    });
}
const server= http.createServer((req,res) =>{
        if(req.method==='GET' && req.url.startsWith('/')){
            res.setCode=200;
            res.setHeader('Content-Type', 'text/plain; chatset= utf-8');
            res.end(
                'Ultimos titulos h1 de la pagina ${scaperingUrl}:\n' +
                '${ultimoTitulo.join('-')}\n'
            );
        }else if(req.method==='GET' && req.ur=== '/headlines'){
            res.setCode=200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            
            const respuesta= {
                updatedAt: lastUpdated,
                headlines: ultimoTitulo
            }

            res.end(JSON.stringify(respuesta, null, 2))
        }
        else{
            res.setCode= 404;
            res.setHeader('Content-Type', 'text/plain; charset= utf-8');
            res.end('Not Found\n');
        };
    })
    
server.listen(PORT, ()=>{
    console.log('Servidor escuchando en http://localhost:${PORT}');
})


