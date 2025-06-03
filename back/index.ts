import cors from '@fastify/cors'
import websocketPlugin from '@fastify/websocket'
import fastify from 'fastify'

import 'dotenv/config'
import MemeGenerationController from './controllers/MemeGenerationController'
import TLDrawSyncController from './controllers/TLDrawSyncController'

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// For this example we use a simple fastify server with the official websocket plugin
// To keep things simple we're skipping normal production concerns like rate limiting and input validation.
const app = fastify({ logger: true });
app.register(websocketPlugin);
app.register(cors, { origin: '*', methods: ["POST", "GET", "PUT", "PATCH"] });

app.register(MemeGenerationController, { prefix: '/memes' });
app.register(TLDrawSyncController, { prefix: '/sync' });

app.get('/ping', async (req, res) => {
	res.send("pong")
});

app.listen({ host: HOST, port: PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
});
