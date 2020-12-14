"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var uuid_1 = require("uuid");
var path_1 = __importDefault(require("path"));
var socket_io_1 = __importDefault(require("socket.io"));
var app = express_1.default();
var server = new http_1.Server(app);
var io = new socket_io_1.default.Server(server);
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.redirect("/" + uuid_1.v4());
});
app.get('/:room', function (req, res) {
    res.render('room', { roomId: req.params.room });
});
io.on('connection', function (socket) {
    socket.on('join-room', function (roomId, userId) {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('disconnect', function () {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});
server.listen(8000, function () {
    console.log("Server is running on PORT 8000");
});
