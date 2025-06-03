import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { RawData } from "ws";
import { unfurl } from "unfurl.js";
import { RoomStorageService } from "../services/RoomStorageService";
import { RoomService } from "../services/RoomService";
import { ProjectService } from "../services/ProjectService";
import { ProjectStorageService } from "../services/ProjectStorageService";
import { Project } from "../models/Project";

const TLDrawSyncController: FastifyPluginCallback = (app, _, done) => {
	const schemaCommon = {
		tags: ["TLDraw Sync"],
	};

	const storageService = new RoomStorageService(app.log);
	storageService.init();
	const roomService = new RoomService(app.log, storageService);
	const projectStorageService = new ProjectStorageService(app.log);
	projectStorageService.init();
	const projectService =  new ProjectService(app.log, projectStorageService);
	// Initialize the room service to load existing rooms from storage
	roomService.init();
	// This is the main entrypoint for the multiplayer sync
	app.get('/connect/:roomId', { websocket: true }, async (socket, req) => {
		// The roomId comes from the URL pathname
		const roomId = (req.params as any).roomId as string
		// The sessionId is passed from the client as a query param,
		// you need to extract it and pass it to the room.
		const sessionId = (req.query as any)?.['sessionId'] as string

		// At least one message handler needs to
		// be attached before doing any kind of async work
		// https://github.com/fastify/fastify-websocket?tab=readme-ov-file#attaching-event-handlers
		// We collect messages that came in before the room was loaded, and re-emit them
		// after the room is loaded.
		const caughtMessages: RawData[] = []

		const collectMessagesListener = (message: RawData) => {
			caughtMessages.push(message)
		}

		socket.on('message', collectMessagesListener)

		// Here we make or get an existing instance of TLSocketRoom for the given roomId
		const room = await roomService.makeOrLoadRoom(roomId)
		// and finally connect the socket to the room
		room.handleSocketConnect({ sessionId, socket })

		socket.off('message', collectMessagesListener)

		// Finally, we replay any caught messages so the room can process them
		for (const message of caughtMessages) {
			socket.emit('message', message)
		}
	})

	// To enable blob storage for assets, we add a simple endpoint supporting PUT and GET requests
	// But first we need to allow all content types with no parsing, so we can handle raw data
	app.addContentTypeParser('*', (_, __, done) => done(null))
	app.put('/uploads/:id', {}, async (req, res) => {
		const id = (req.params as any).id as string
		await storageService.saveAsset(id, req.raw)
		res.send({ ok: true })
	})

	app.get('/uploads/:id', async (req, res) => {
		const id = (req.params as any).id as string
		const data = await storageService.loadAsset(id)
		res.send(data)
	})

	// To enable unfurling of bookmarks, we add a simple endpoint that takes a URL query param
	app.get('/unfurl', async (req, res) => {
		const url = (req.query as any).url as string
		res.send(await unfurl(url))
	})

	app.get('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
		// Create a new room
		const projects = await projectService.listProjects();
		reply.send(projects);
	});

	app.post('/rooms', async (request: FastifyRequest<{ Body: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.body;
		// Create a new room
		const room = await roomService.createRoom(id);
		reply.send(room);
	});

	app.post('/projects', async (request: FastifyRequest<{ Body: Project}>, reply: FastifyReply) => {
		// Create a new project
		const project = await projectService.create(request.body);
		const room_id = "room_" + project.id;
		const room = await roomService.createRoom(room_id);
		project.roomId = room_id;
		await projectService.update(project);
		await storageService.save(room_id, room.getCurrentSnapshot());
		reply.send(project);
	});

	app.get('/rooms/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		// Get room details
		const room = roomService.loadRoom(id);
		reply.send(room);
	});

	app.delete('/rooms/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		// Delete the room
		roomService.deleteRoom(id);
		reply.status(204).send();
	});

	done();
};

export default TLDrawSyncController;
