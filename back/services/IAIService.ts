import { MemePromptResponse } from "../models/memegeneration/MemePromptResponse";

/**
 * IAIService
 * 
 * Interface for an AI service that processes meme prompts.
 * Provides a method to analyze a textual prompt and return a structured response
 * suitable for meme generation (e.g., template ID and text lines).
 */
export interface IAIService {
    /**
     * Processes a meme prompt command using AI.
     * Analyzes the given prompt and returns a MemePromptResponse containing
     * the selected template ID and the text lines to use in the meme.
     * @param prompt The text prompt describing the meme to generate.
     * @returns A promise resolving to a MemePromptResponse object.
     */
    processMemePrompt(prompt: string): Promise<MemePromptResponse>;
}