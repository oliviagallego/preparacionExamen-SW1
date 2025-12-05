const https= require('https');
const os= require('os');
const {URL}= require ('url');
const config= require ('./config.json');
const cheerio= require('cheerio');

const PORT= config.PORT || 3000;
const intervalo_ms= config.intervalo_ms ||10000;
const scarpeURL = config.scapeURL || `https://www.booking.com/index.es.html`;

//vamos a extraer como info específica: el título de la página y la descripción
let ultimoTitulo = 'Sin info todavia';
let ultimaDescripcion= 'Sin info todavia';

// 1. Función que hace el scraping: baja el HTML y extrae título + descripción
function hacerScarping(){
    console.log('Haciendo scarping de la web: ${scarpeURL}');

    https.get(scarpeURL, (res) =>{
        let html= '';
        res.on('data', chunk =>{
            html += chunk
        });
        res.on('end', ()=> {
            const $= cheerio.load(html);
            const titulo= $('titulo').text().trim();
            const descripcion= $('meta[name="descrpcion"]').attr('constent').trim();

            ultimoTitulo= titulo || 'Sin titulo';
            ultimaDescripcion= descripcion || 'Sin descripcion';

            const timestamp= new Date().totalMilliseconds();

            console.log('Scarping completado a las ${tiemstamp}:');
            console.log('Titulo: ${ultimoTitulo}');
            console.log('Ultima descripcion: ${ultimaDescripcion}');
        });
    }).on ('error', (err) => {
        console.err('Error al hacer scraping', err.message);
    });
}
hacerScarping();

setInterval(hacerScarping, intervalo_ms);

const server= http.createServer((res,req) =>{
    res.startCode=200;
    res.setHeader('Content-Type', 'text/plane');
    res.end(
        'Ultimos datos de la pagina ${scarpeUrl}:\n',
        'Titulos: ${ultimoTitulo}',
        'Descripcion: ${ultimaDesccripcion}'
    )
});

server.listen(PORT, ()=> {
    console.log('servidor escuchando en http://localhost:${PORT}');
}
);