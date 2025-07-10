from google import genai
from google.genai import types
import json
from fastapi import FastAPI, Body
from pydantic import BaseModel
import vars

    
app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str

class ResponseData(BaseModel):
    id: str
    lines: list[str]

@app.post("/processPrompt", response_model=ResponseData)
def process_prompt(data: PromptRequest):
    prompt = data.prompt
    result = getParamsFromPrompt(prompt=prompt)
    if not [elem["id"] for elem in raw_templates].__contains__(result.id):
        result = ResponseData(id = getParamsFromPrompt(prompt="The ID you provided doesn't exist in the list, try again").id, lines=result.lines)
        if not [elem["id"] for elem in raw_templates].__contains__(result.id):
            result = ResponseData(id="buzz", lines=result.lines)
    return result

raw_templates: any
templates = ''

with open('templates_clean.json', 'r', encoding='utf-8') as infile:
    raw_templates = json.load(infile)
    templates = str(raw_templates)
    
meme_generator_function = {
        "name": "getMeme",
        "description": "generate a meme in PNG form",
        "parameters": {
            "type": "object",
            "properties": {
                "meme_template_id": {
                    "type": "string",
                    "description": "Id of the meme template"
                },
                "upper_text":{
                    "type": "string",
                    "description": "Text shown at the top of the meme"
                },
                "lower_text":{
                    "type": "string",
                    "description": "Text shown at the bottom of the meme"
                }

            },
            "required": ["meme_template_id", "upper_text", "lower_text"]
        }
}


tools = types.Tool(function_declarations=[meme_generator_function])

config=types.GenerateContentConfig(
        system_instruction="""You are memeGenAI. Your core function is to generate memes by extracting specific details from user prompts.

Meme Generation Requirements:

For every user request, you must identify and extract the following:

- Meme Template ID: This ID must correspond exactly to one of the id values found in the JSON array of meme templates provided after these instructions. You are responsible for accurately determining the template the user intends, even if they describe it indirectly. For example, if a user says, "I want a meme of the crazy alien dude," you must recognize this refers to the "ancient aliens guy" and return aag as the template ID.

- Upper Text: The text designated for the top portion of the meme. This can be empty if the user explicitly requests it.

- Lower Text: The text designated for the bottom portion of the meme. This can also be empty if the user explicitly requests it.

Handling Broad or Sentiment-Based Requests:

- If a user's prompt describes a general sentiment or situation rather than a specific meme template or text, you should:

- Consult the sentiments and useCase fields within the meme template JSON.

- Select the most fitting meme template, along with appropriate (or empty, if implied) upper and lower text, to match the user's expressed sentiment or situation.

Here are the templates: \n\n""" + templates, tools=[tools])

client = genai.Client(api_key=vars.ALBERT_API_KEY)

def getParamsFromPrompt(prompt: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=config,
        contents=prompt
    )

    if response.candidates[0].content.parts[0].function_call:
        function_call = response.candidates[0].content.parts[0].function_call
        if function_call.name == "getMeme":
            print(f"Function to call: {function_call.name}")
            print(f"Arguments: {function_call.args}")
            args = function_call.args
            return ResponseData(id=args["meme_template_id"], lines=[args["upper_text"], args["lower_text"]])
        else:
            print("Somehow it is not the meme function that was called.")
    else:
        print("No function call found in the response.")
        print(response.text)