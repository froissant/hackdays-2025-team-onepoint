import { MemePromptResponse } from "../models/memegeneration/MemePromptResponse";
import { IAIService } from "./IAIService";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import { readFileSync } from "fs";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { initializeAgentExecutorWithOptions } from "langchain/agents";




export default class AlbertHandlerService implements IAIService {
    
    private raw = readFileSync("../resources/templates_clean.json", "utf-8");
    private templates = JSON.parse(this.raw);
    /**
     * Processes a meme prompt using the external AI API.
     * Sends the prompt to the API and returns the structured response.
     * @param prompt The text prompt describing the meme to generate.
     * @returns A promise resolving to a MemePromptResponse object.
     * @throws Error if the API call fails.
     */
    async processMemePrompt(prompt: string): Promise<MemePromptResponse> {
        const generateMeme = new DynamicStructuredTool({
            name: "generateMeme",
            description: "Generate a meme by providing the meme_template_id, upper_text and lower_text",
            schema: z.object({
              meme_template_id: z.string().describe("Id of the meme template"),
              upper_text: z.string().describe("Text shown at the top of the meme"),
              lower_text: z.string().describe("Text shown at the bottom of the meme"),
            }),
            func: async ({ meme_template_id, upper_text, lower_text }) => {
              return {id: meme_template_id, lines: [upper_text, lower_text]};
            },
          });
          
          // Chat Model with custom API base and API key
          const chatModel = new ChatOpenAI({
            openAIApiKey: "sk-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4Mzk2LCJ0b2tlbl9pZCI6MTQ3NywiZXhwaXJlc19hdCI6MTc4MDM1MTIwMH0.E6V2y8osrVLdPT3kMDCxongzsRAXxvGeEt5hlKhGJLA",
            configuration: {
              baseURL: "https://albert.api.etalab.gouv.fr/v1",
            },
            modelName: "albert-small",
          });
          
          // Custom system message
          const systemInstructions = new SystemMessage({
            content: "You are memeGenAi, you will be prompted to generate memes and you are required to extract the id of the meme template, the upper text and the lower text."
            + " the id of the template must absolutely exist in the json array below that contains the id, name, sentiment and useCase of many meme templates. It is your task to know which template the user is refering to, by comparing the description to the names and ids, and return the corresponding id."
            + " For example, if the user says 'I want a meme of the crazy alien dude' it is your task to know they're refering to the ancient aliens guy, so you return 'aag' as the id of the meme template."
            + " If the user does not refer to a specific template or upper text or lower text but rather describes a feeling or sentiment or situation, you can refer to the fields sentiments and useCase to make a convenient choice and return the id, upper text or lower text."
            + " The upper and lower text can be empty if requested by the user."
            + " Here is the JSON of all the meme templates:\n\n" + this.templates,
          });
          
          // You can also pre-load messages like this:
          const messages = [
            systemInstructions,
            new HumanMessage({ content: prompt }),
          ];

          const executor = await initializeAgentExecutorWithOptions(
            [generateMeme],
            chatModel,
            {
              agentType: "openai-functions",
              verbose: true,
            }
          );
          
          // Just call the model directly with the system context
          const response = await executor.call(messages);

          if ("toolCalls" in response && response.toolCalls.length > 0) {
            console.log("meme tool called successfully.")
            const toolCall = response.toolCalls[0];
            const args = JSON.parse(toolCall.args);
            const toolResult = generateMeme.func(args);
            return toolResult;
          }

          return Promise.resolve({id:"", lines:[]})
    }
}