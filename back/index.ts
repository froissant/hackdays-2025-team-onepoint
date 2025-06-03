import cors from '@fastify/cors'
import websocketPlugin from '@fastify/websocket'
import fastify, { FastifyRequest } from 'fastify'
import fastifyStatic from '@fastify/static';

import 'dotenv/config'
import MemeGenerationController from './controllers/MemeGenerationController'
import TLDrawSyncController from './controllers/TLDrawSyncController'
import path from 'path';
import { mkdir } from 'fs/promises';
import { BusboyFileStream } from '@fastify/busboy';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';


const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// For this example we use a simple fastify server with the official websocket plugin
// To keep things simple we're skipping normal production concerns like rate limiting and input validation.
const app = fastify({ logger: true });
app.register(fastifyStatic, {
	root: path.join(__dirname, 'public'),
	prefix: '/cdn/', // so previews are accessible via `/previews/...`
});
app.register(cors, { origin: '*', methods: ["POST", "GET", "PUT", "PATCH"] });
app.register(websocketPlugin);
app.register(MemeGenerationController, { prefix: '/memes' });
app.register(TLDrawSyncController, { prefix: '/sync' });
app.get('/ping', async (req, res) => {
	res.send("pong");
});

app.addContentTypeParser('*', (_, __, done) => done(null))
app.put('/api/upload-preview/:projectId', async function (req: FastifyRequest<{ Params: { projectId?: string } }>, reply) {
  const projectId = req.params.projectId ?? 'unknown';
  const filename = `${projectId}.png`;
  const uploadDir = path.join(__dirname, 'public', 'previews');
  const filePath = path.join(uploadDir, filename);
  await mkdir(path.join(__dirname, 'public/previews'), { recursive: true });
  await mkdir(uploadDir, { recursive: true });

  try {
    await pipeline(req.raw, createWriteStream(filePath));
    reply.send({ url: `/cdn/previews/${filename}` });
  } catch (err) {
    reply.status(500).send({ error: 'Failed to save file' });
  }
});

app.listen({ host: HOST, port: PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
});
function pump(file: BusboyFileStream, arg1: any) {
	throw new Error('Function not implemented.');
}

