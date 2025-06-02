import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import MemeGenerationService from "../services/MemeGenerationService";
import { IMemeGenerationService } from "../services/IMemeGenerationService";

const MemeGenerationController: FastifyPluginCallback = (fastify, _, done) => {
    const schemaCommon = {
        tags: ["Meme Generation"],
    };

    const memeService: IMemeGenerationService = new MemeGenerationService();

    // TODO: JWT Authentication.
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
            console.error(err);
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
            console.error(err);
            return reply.status(500).send({ error: "Failed to fetch meme templates" });
        }
    });

    done();
};

export default MemeGenerationController;
