/**
 * IMemeGenerationService
 * 
 * Interface for a service that generates memes using templates and AI prompts.
 * Provides methods to retrieve meme templates, get a template by its ID, and generate memes from prompts.
 */

import { MemeTemplate } from "../models/memegeneration/MemeTemplate"

export interface IMemeGenerationService {
    /**
     * Retrieves a list of all available meme templates.
     * Example endpoint: https://api.memegen.link/templates/
     * @returns A promise resolving to an array of meme templates or null if unavailable.
     */
    getTemplates(): Promise<MemeTemplate[] | null>;

    /**
     * Retrieves a meme template by its ID.
     * Example endpoint: https://api.memegen.link/templates/buzz
     * @param id The unique identifier of the template.
     * @returns A promise resolving to the template object or null if not found.
     */
    getTemplateById(id: string): Promise<MemeTemplate | null>

    /**
     * Generates a meme from a textual prompt.
     * Uses AI to process the prompt and generate meme content.
     * @param prompt The text prompt describing the meme to generate.
     * @returns A promise resolving to the URL of the generated meme or a Blob object.
     */
    generateMemeFromPrompt(prompt: string): Promise<Blob | string>;
}