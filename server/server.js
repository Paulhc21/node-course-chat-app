const path = require( 'path' ),
      http = require( 'http' ),
      express = require( 'express' ),
      app = express(),
      socketIO = require( 'socket.io' );

const { generateMessage, generateLocationMessage } = require( './utils/message' );
const { isRealString } = require( './utils/validation' );
const { Users } = require( './utils/users' );

const publicPath = path.join( __dirname, '../public' );
const port = process.env.PORT || 3000;
const server = http.createServer( app );
const io = socketIO( server );

var users = new Users();

app.use(express.static( publicPath ));

io.on('connection', ( socket ) => {
    console.log('New user connected');

    socket.on('join', ( roomParams, callback ) => {
        if ( !isRealString(roomParams.name) || !isRealString(roomParams.room) ) {
            return callback('Name and room name are required');
        }

        socket.join(roomParams.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, roomParams.name, roomParams.room);

        io.to(roomParams.room).emit('updateUserList', users.getUserList(roomParams.room));

        socket.emit('newMessage', generateMessage( 'Admin', 'Welcome to the ExPeriEnce' ));
        socket.broadcast.to(roomParams.room).emit('newMessage', generateMessage( 'Admin', `The CrEatuRe ${ roomParams.name } has joined!` ));

        callback();
    });

    socket.on('createMessage', ( message, callback ) => {
        console.log('Message created', message);

        io.emit('newMessage', generateMessage( message.from, message.text ));
        callback();
    });

    socket.on('createLocationMessage', ( coords ) => {
        io.emit('newLocationMessage', generateLocationMessage( 'Creature', coords.latitude, coords.longitude ))
    })

    socket.on('disconnect', ( reason ) => {
        var user = users.removeUser(socket.id);

        if ( user ) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `The CrEatuRe ${ user.name } has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});