import MemeTemplate from "../models/memegeneration/MemeTemplate";
import { IMemeGenerationService } from "./IMemeGenerationService";

export default class MemeGenerationService implements IMemeGenerationService {

    private templatesCache: MemeTemplate[] | null = null;

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

    async getTemplateById(id: string): Promise<MemeTemplate | null> {
        if (!this.templatesCache) {
            await this.getTemplates();  // populate cache if empty
        }
        const template = this.templatesCache?.find(t => t.id === id) ?? null;
        return template;
    }

    generateMemeUrl(templateId: string, topText: string, bottomText: string): string {
        throw new Error("Method not implemented.");
    }

    fetchMemeImage?(memeUrl: string): Promise<Blob | string> {
        throw new Error("Method not implemented.");
    }

    private readonly baseUrl = process.env.MEMEGEN_API_URL;
}