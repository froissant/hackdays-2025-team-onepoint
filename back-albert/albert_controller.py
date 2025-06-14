from openai import OpenAI
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
    
tools = [
    {
        "type": "function",
        "function": {
            "name": "getMeme",
            "description": "generate a meme in png form",
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
    }
]

client = OpenAI(
    base_url = 'https://albert.api.etalab.gouv.fr/v1',
    api_key=vars.ALBERT_API_KEY,
)

def getParamsFromPrompt(prompt: str):
    response = client.chat.completions.create(
        model="albert-small",
        messages=[
            {"role": "system", "content": "You are memeGenAi, you will be prompted to generate memes and you are required to extract the id of the meme template, the upper text and the lower text."
            "the id of the template **MUST** absolutely exist in the json array below. It is your task to know which template the user is refering to, by comparing the description to the names and ids, and return the corresponding id."
            "For example, if the user says 'I want a meme of the crazy alien dude' it is your task to know they're refering to the ancient aliens guy, so you return 'aag' as the id of the meme template."
            "If the user does not refer to a specific template or upper text or lower text but rather describes a sentiment or situation, you can refer to the fields 'sentiments' and 'useCase' to make a convenient choice and generate a png with a convenient id, upper and lower text."
            "The upper and lower text can be empty if requested by the user."
            "Here is the JSON of all the meme templatess:\n\n" + templates},
            {"role": "user", "content": prompt}
        ],
        tools=tools,
        tool_choice="auto"
    )
    tool_calls = response.choices[0].message.tool_calls
    if tool_calls:
        for call in tool_calls:
            if call.function.name == "getMeme":
                args = json.loads(call.function.arguments)
                # if not [elem["id"] for elem in raw_templates].__contains__(args["meme_template_id"]):
                #     return ResponseData(id="", lines=[])
                return ResponseData(id=args["meme_template_id"], lines=[args["upper_text"], args["lower_text"]])
        return ResponseData(id="", lines=[])