const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const app = express();
const path = require('path');
const morgan = require('morgan');
const SocketIO = require('socket.io');

// configuraciones
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');





// conexion servidor
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), ()=>{
    console.log('conectado al puerto ' + app.get('port'));
});

// conexion base de datos
mongoose.connect('mongodb+srv://stodulski:stodulski8@cluster0.ihj7z.mongodb.net/users', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, ()=>{
    console.log('conectado a la base de datos');
});

// socket.io
const io = SocketIO(server);



// mongoose
const User = require('./model/accounts');


// rutas 
app.get('/hola', (req, res)=>{
    User.find({}, function (err, user) {
        if(err) return handleError(err);        
        if(user){
            var products = user;
            io.on('connect', (socket)=>{
                console.log('nueva conexion '+ socket.id);
                socket.emit('shop:products', {
                    products: products
                });
            
    
            }); 
            res.render('hola');
            return Promise.resolve(true);            
            }
    return Promise.resolve(false);
    });
})




