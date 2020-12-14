import express, { Request, Response } from 'express';
import { Server } from 'http';
import { v4 as uuid } from 'uuid';
import path from 'path';
import socketio, { Socket } from 'socket.io';

const app = express();
const server = new Server(app);
const io = new socketio.Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
	res.redirect(`/${uuid()}`);
});

app.get('/:room', (req: Request, res: Response) => {
	res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket: Socket) => {
	socket.on('join-room', (roomId: string, userId: number) => {
		socket.join(roomId);
		socket.to(roomId).broadcast.emit('user-connected', userId);

		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId);
		});
	});
});

server.listen(8000, () => {
	console.log(`Server is running on PORT 8000`);
});
