"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const routes_1 = __importDefault(require("./routes/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongo_1 = require("./database/mongo");
const cors_1 = __importDefault(require("cors"));
const multer_1 = require("multer");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, mongo_1.mongoConnect)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(routes_1.default);
app.use((req, res) => {
    res.status(404).json({ error: 'Página não encontrada' });
});
const errorHandler = (error, req, res, next) => {
    res.status(400);
    if (error instanceof multer_1.MulterError) {
        res.json({ error: error.message });
    }
    else {
        console.log(error);
        res.json({ error: 'Ocorreu algum erro' });
    }
};
app.use(errorHandler);
server.listen(process.env.PORT);
let connectedUsers = [];
exports.io.on('connection', (socket) => {
    console.log('conexão estabeleciada');
    socket.on('join-request', (user) => {
        socket.username = user.userName;
        connectedUsers.push(user);
        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: user,
            list: connectedUsers
        });
    });
    socket.on('disconnect', () => {
        const user = connectedUsers.filter(item => item.userName === socket.username);
        connectedUsers = connectedUsers.filter(item => item.userName != socket.username);
        socket.broadcast.emit('list-update', {
            left: user[0],
            list: connectedUsers
        });
    });
    socket.on('send-msg', (data) => {
        socket.emit('show-msg', data);
        socket.broadcast.emit('show-msg', data);
    });
    socket.on('status-color', (data) => {
        connectedUsers.map((item) => {
            if (item.avatar === data.user.avatar) {
                item.statusColor = data.color;
            }
        });
        socket.broadcast.emit('update-status', data, connectedUsers);
    });
});
