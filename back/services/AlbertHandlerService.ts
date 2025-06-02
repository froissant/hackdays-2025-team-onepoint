/**
 * AlbertHandlerService
 * 
 * Implementation of the IAIService interface.
 * This service communicates with an external AI API to process meme prompts.
 * It sends a textual prompt to the AI API and receives a structured MemePromptResponse,
 * which includes the selected template ID and the text lines for meme generation.
 */

import MemePromptResponse from "../models/memegeneration/MemePromptResponse";
import { IAIService } from "./IAIService";

export default class AlbertHandlerService implements IAIService {

    /**
     * The base URL for the external AI API.
     */
    private readonly baseUrl = process.env.AI_API_URL;

    /**
     * Processes a meme prompt using the external AI API.
     * Sends the prompt to the API and returns the structured response.
     * @param prompt The text prompt describing the meme to generate.
     * @returns A promise resolving to a MemePromptResponse object.
     * @throws Error if the API call fails.
     */
    async processMemePrompt(prompt: string): Promise<MemePromptResponse> {
        const response = await fetch(`${this.baseUrl}/processPrompt`, {
            "method": 'POST',
            "headers": {
                'Content-Type': 'application/json',
            },
            "body": JSON.stringify({
                "prompt": prompt
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to post meme prompt: ${response.statusText}`);
        }

        return await response.json();
    }
}