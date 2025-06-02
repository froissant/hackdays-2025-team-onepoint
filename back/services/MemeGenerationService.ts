/**
 * Meme generation service from prompts or templates.
 * Uses an AI service to generate meme content, then calls an external API to create the image.
 * Caches templates to optimize network calls.
 */

import { MemeGenRequest } from "../models/memegeneration/MemeGenRequest";
import { MemePromptResponse } from "../models/memegeneration/MemePromptResponse";
import { MemeTemplate } from "../models/memegeneration/MemeTemplate";
import { IAIService } from "./IAIService";
import { IMemeGenerationService } from "./IMemeGenerationService";

/**
 * Implementation of the meme generation service.
 */
export default class MemeGenerationService implements IMemeGenerationService {
    private aiService: IAIService;
    private readonly baseUrl = process.env.MEMEGEN_API_URL;

    /**
     * Initializes the service with a dependency on an AI service.
     * @param aiService AI service for processing prompts.
     */
    constructor(aiService: IAIService) {
        this.aiService = aiService;
    }

    /**
     * Local cache of meme templates to avoid repeated network calls.
     */
    private templatesCache: MemeTemplate[] | null = null;

    /**
     * Generates a meme from a textual prompt.
     * @param prompt Text describing the meme to generate.
     * @returns The URL of the generated meme or a Blob object.
     * @throws Error if generation fails.
     */
    async generateMemeFromPrompt(prompt: string): Promise<Blob | string> {
        const result: MemePromptResponse = await this.aiService.processMemePrompt(prompt);
        return await this.createMeme(result.id, result.lines);
    }

    /**
     * Creates a meme from a template and text lines.
     * @param template_id ID of the template to use.
     * @param lines Text lines to insert into the meme.
     * @returns The URL of the generated meme.
     * @throws Error if creation fails.
     */
    async createMeme(template_id: string, lines: string[]) {
        const payload: MemeGenRequest = {
            template_id,
            text: lines,
        };

        const response = await fetch(`${this.baseUrl}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create meme: ${error}`);
        }

        const result = await response.json();
        return result.url;
    }

    /**
     * Retrieves the list of available meme templates (with cache).
     * @returns List of templates or null.
     * @throws Error if retrieval fails.
     */
    async getTemplates(): Promise<MemeTemplate[] | null> {
        if (this.templatesCache) {
            return this.templatesCache;
        }

        const response = await fetch(`${this.baseUrl}/templates/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch templates: ${response.statusText}`);
        }

        this.templatesCache = await response.json();
        return this.templatesCache;
    }

    /**
     * Retrieves a meme template by its ID.
     * @param id Template ID.
     * @returns The matching template or null.
     */
    async getTemplateById(id: string): Promise<MemeTemplate | null> {
        if (!this.templatesCache) {
            await this.getTemplates();
        }
        const template = this.templatesCache?.find(t => t.id === id) ?? null;
        return template;
    }
}