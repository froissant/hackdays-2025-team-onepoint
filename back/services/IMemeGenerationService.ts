import Template from "../models/memegeneration/MemeTemplate"

export interface IMemeGenerationService {
  /**
   * Get a list of all available meme templates.
   * Example: https://api.memegen.link/templates/
   */
  getTemplates(): Promise<Template[]| null>;

  /**
   * Get a template by its id
   * Example: https://api.memegen.link/templates/buzz
   */
   getTemplateById(id: string): Promise<Template | null>

  /**
   * Generate a meme URL using a specific template and text.
   * @param templateId - ID of the meme template (e.g., "buzz", "drake").
   * @param topText - Text to appear at the top of the meme.
   * @param bottomText - Text to appear at the bottom of the meme.
   * @returns URL of the generated meme image.
   */
  generateMemeUrl(templateId: string, topText: string, bottomText: string): string;

  /**
   * Optionally fetch the actual meme image (as a Blob or base64 string).
   * @param memeUrl - URL of the generated meme image.
   */
  fetchMemeImage?(memeUrl: string): Promise<Blob | string>;
}
