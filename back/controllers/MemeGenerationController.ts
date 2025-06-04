import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import MemeGenerationService from "../services/MemeGenerationService";
import { IMemeGenerationService } from "../services/IMemeGenerationService";
import { IAIService } from "../services/IAIService";
import AlbertHandlerService from "../services/AlbertHandlerService";
import { IRoomStorageService } from "../services/IRoomStorageService";
import { RoomStorageService } from "../services/RoomStorageService";
import { randomUUID } from "crypto";

const MemeGenerationController: FastifyPluginCallback = (fastify, _, done) => {
    const schemaCommon = {
        tags: ["Meme Generation"],
    };

    const iaService: IAIService = new AlbertHandlerService();
    const memeService: IMemeGenerationService = new MemeGenerationService(iaService);
    const roomStorageService: IRoomStorageService = new RoomStorageService(fastify.log);


    // TODO: JWT Authentication.

    fastify.post("/generateFromPrompt", async (request, reply) => {
        const promptText = request.body;

        if (typeof promptText !== "string" || promptText.trim() === "") {
            return reply.code(400).send({ error: "Request body must be a non-empty string" });
        }

        const url = await memeService.generateMemeFromPrompt(promptText) as string;

        const response = await fetch(url, { method: "GET" });

        const id = randomUUID();
        //Incompatibility of ReadStreams... To fix later
        roomStorageService.saveAsset(id, await response.bytes());

        return reply.send({ id });
    });

    fastify.get("/templates/:id", {
        schema: {
            params: {
                type: "object",
                properties: {
                    id: { type: "string" }
                },
                required: ["id"]
            }
        }
    }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const { id } = request.params;
            const template = await memeService.getTemplateById(id);

            if (!template) {
                return reply.status(404).send({ error: "Template not found" });
            }

            return reply.status(200).send(template);
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch meme template" });
        }
    });

    fastify.get("/templates", {
        schema: {
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            blank: { type: "string" },
                            example: {
                                type: "object",
                                properties: {
                                    url: { type: "string" },
                                },
                            },
                        },
                    },
                },
                204: {
                    type: "null",
                    description: "No Content",
                },
                401: {
                    type: "null",
                    description: "Unauthorized",
                },
            },
            ...schemaCommon,
        },
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const templates = await memeService.getTemplates();

            if (templates === null || templates.length === 0) {
                return reply.status(204).send();
            }

            return reply.status(200).send(templates);
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch meme templates" });
        }
    });

    done();
};

export default MemeGenerationController;
