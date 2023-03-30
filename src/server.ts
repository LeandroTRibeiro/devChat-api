import express, { Request, Response, ErrorRequestHandler } from 'express';
import { mongoConnect } from './database/mongo';

import { Server } from 'socket.io';

import cors from 'cors';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import router from './routes/routes';

import { MulterError } from 'multer';

import { RingColorType, SendMsgType, UserTypeFront } from './types/types';

dotenv.config();

mongoConnect();

const app = express();

app.use(cors());

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use(router);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Página não encontrada' });
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    res.status(400);

    if (error instanceof MulterError) {
        res.json({ error: error.message });
    } else {
        console.log(error);
        res.json({ error: 'Ocorreu algum erro' });
    }

};

app.use(errorHandler)

server.listen(process.env.PORT);

let connectedUsers: UserTypeFront[] = [];

io.on('connection', (socket) => {

    console.log('conexão estabeleciada');
    
    socket.on('join-request', (user: UserTypeFront) => {

        (socket as any).username = user.userName;

        connectedUsers.push(user);
 
        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: user,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {

        const user = connectedUsers.filter(item => item.userName === (socket as any).username);

        connectedUsers = connectedUsers.filter(item => item.userName != (socket as any).username);
        

        socket.broadcast.emit('list-update', {
            left: user[0],
            list: connectedUsers
        });
        
    });

    socket.on('send-msg', (data: SendMsgType) => {
        socket.emit('show-msg', data);
        socket.broadcast.emit('show-msg', data);
    });

    socket.on('status-color', (data: RingColorType) => {

        connectedUsers.map((item) => {
            if(item.avatar === data.user.avatar){
                item.statusColor = data.color
            }
        });
        
        socket.broadcast.emit('update-status', data, connectedUsers);
    });

});
