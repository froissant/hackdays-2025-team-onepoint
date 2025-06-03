import { MemePromptResponse } from "../models/memegeneration/MemePromptResponse";
import { IAIService } from "./IAIService";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import { readFileSync } from "fs";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentExecutor, createToolCallingAgent, initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";




export default class AlbertHandlerService implements IAIService {
    
    private raw = readFileSync("./resources/templates_clean.json", "utf-8");
    private templates = JSON.parse(this.raw);
    /**
     * Processes a meme prompt using the external AI API.
     * Sends the prompt to the API and returns the structured response.
     * @param prompt The text prompt describing the meme to generate.
     * @returns A promise resolving to a MemePromptResponse object.
     * @throws Error if the API call fails.
     */
    async processMemePrompt(query: string): Promise<MemePromptResponse> {
        // const generateMeme = new DynamicStructuredTool({
        //     name: "generateMeme",
        //     description: "Generate a meme in png format",
        //     schema: z.object({
        //       meme_template_id: z.string().describe("Id of the meme template"),
        //       upper_text: z.string().describe("Text shown at the top of the meme"),
        //       lower_text: z.string().describe("Text shown at the bottom of the meme"),
        //     }),
        //     func: async ({ meme_template_id, upper_text, lower_text }) => {
        //       return {id: meme_template_id, lines: [upper_text, lower_text]};
        //     },
        //   });
        const generateMeme = tool(
            async ({ meme_template_id, upper_text, lower_text }) => {
              return {id: meme_template_id, lines: [upper_text, lower_text]};
            },
          {name: "generateMeme",
            description: "Generate a meme in png format",
            schema: z.object({
              meme_template_id: z.string().describe("Id of the meme template"),
              upper_text: z.string().describe("Text shown at the top of the meme"),
              lower_text: z.string().describe("Text shown at the bottom of the meme"),
            }),
            }
        )
          
          // Chat Model with custom API base and API key
          const chatModel = new ChatOpenAI({
            openAIApiKey: "sk-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4Mzk2LCJ0b2tlbl9pZCI6MTQ3NywiZXhwaXJlc19hdCI6MTc4MDM1MTIwMH0.E6V2y8osrVLdPT3kMDCxongzsRAXxvGeEt5hlKhGJLA",
            configuration: {
              baseURL: "https://albert.api.etalab.gouv.fr/v1",
            },
            model: "neuralmagic/Meta-Llama-3.1-70B-Instruct-FP8",
          });

          const messages = ChatPromptTemplate.fromMessages([
            ["system", "You are memeGenAi, you will be prompted to generate a meme in png format."
            + " the id of the template must absolutely exist in on of the elements of the JSON array below. It it your task to know what meme the user is referring to, even if he isn't explicit."
            + " For example, if the user says 'I want a meme of the crazy alien dude' it is your task to know they're refering to the ancient aliens guy, so you recognise 'aag' as the id of the meme template."
            + " If the user does not refer to a specific template but rather describes a sentiment or a situation, you can refer to the fields sentiments and useCase to make a convenient choice of meme id."
            + " The upper or lower text can be empty if requested by the user."
            + " Once you have extracted the id, upper text and bottom text, you must generate a png of the meme using the generateMeme tool."
            + " Here is the JSON of all the meme templates:\n\n" + JSON.stringify(this.templates)],
            ["placeholder", "{chat_history}"],
            ["placeholder", "{agent_scratchpad}"],
]);
          
          // Custom system message
          // const systemInstructions = new SystemMessage({
          //   content: "You are memeGenAi, you will be prompted to generate a meme in png format."
          //   + " the id of the template must absolutely exist in on of the elements of the JSON array below. It it your task to know what meme the user is referring to, even if he isn't explicit."
          //   + " For example, if the user says 'I want a meme of the crazy alien dude' it is your task to know they're refering to the ancient aliens guy, so you recognise 'aag' as the id of the meme template."
          //   + " If the user does not refer to a specific template but rather describes a sentiment or a situation, you can refer to the fields sentiments and useCase to make a convenient choice of meme id."
          //   + " The upper or lower text can be empty if requested by the user."
          //   + " Once you have extracted the id, upper text and bottom text, you must generate a png of the meme using the generateMeme tool."
          //   + " Here is the JSON of all the meme templates:\n\n" + JSON.stringify(this.templates),
          // });
          
          // const messages = [
          //   systemInstructions,
          //   new HumanMessage({ content: prompt }),
          // ];
          // chatModel.bindTools([generateMeme]);

          // const executor = await initializeAgentExecutorWithOptions(
          //   [generateMeme],
          //   chatModel,
          //   {
          //     agentType: "openai-functions",
          //     verbose: false,
          //   }
          // );

          const tools = [generateMeme]

          const agent = createToolCallingAgent({
            llm: chatModel,
            tools,
            prompt: messages,
          });
          const agentExecutor = new AgentExecutor({
            agent,
            tools,
          });
          
          // Just call the model directly with the system context
          const response = await agentExecutor.invoke({input: query});
          console.log("response: " + JSON.stringify(response))
          if (response.tool_calls && response.tool_calls.length > 0) {
            console.log("meme tool called successfully.")
            const toolCall = response.tool_calls[0];
            console.log(toolCall.args);
            // const toolResult = generateMeme.func(toolCall.args);
            // return toolResult;
          }

          return Promise.resolve({id:"", lines:[]})
    }
}