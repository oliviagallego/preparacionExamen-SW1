var express= require('express');
var router= express.Router();

const products=[
    {id: 1, name:'Mujercitas', precio: 10, descripcion: 'Clasico de navidad en familia.'},
    {id:2, name: 'Holidays', precio:20, descripcion: 'Pelicula de amor navideña.'},
    {id:3, name: 'Elf', precio:5, descripcion: 'Comedia para niños navideña.'}
];

router.get('/', function(req, res, next){
    res.render('index', {title: 'Catalogo de Pelicuals', products: products});
});

router.get('/product/:id', function(req, res, next){
    const id= parseInt(req.params.id, 10);
    const product= products.find(p=> p.id === id);

    if(!product){
        res.status(404).send('Producto no encontrado');
        return;
    }else{
        res.send('Has seleccionado el producto con id:' +id);
    }

    res.render('product',{
        title: 'Detalle de producto',
        product: product
    })
});

router.post('/product/:id/comment', function(req, res, next) {
    const id= req.params.id;
    const nombre= req.body.nombre;
    const comentario= req.body.comentario;

    res.send(`Comentario recibido para el producto ${id} de nombre ${name}: ${comentario}`);

});

module.exports= router;
