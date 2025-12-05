//lógica, datos, decides qué vista usar.

const express= require ('express');
const router = express.Router();

router.get('/', function(req, res, next){// req → la petición (request), res → la respuesta (response), next → función para pasar al siguiente middleware (a veces)
    const items=[
        { nombre: 'Gato', descripcion: 'Le encanta dormir.' },
        { nombre: 'Perro', descripcion: 'Siempre quiere jugar.' },
        { nombre: 'Hamster', descripcion: 'Corre en la rueda.' }
    ];
    res.render('index',
        { title: 'Inicio', items: items }
    );
});

router.get('/login', function(req, res, next){
    res.render('login',
        { title: 'Iniciar sesión' }
    );
})
router.post('/login', function(req, res, next) {
  res.send('Login recibido (aquí comprobaríamos usuario y contraseña)');
});

module.exports = router;