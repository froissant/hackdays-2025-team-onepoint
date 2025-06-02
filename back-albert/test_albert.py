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
    return getParamsFromPrompt(prompt=prompt)

templates = ''

with open('templates_clean.json', 'r', encoding='utf-8') as infile:
    templates = str(json.load(infile))
    
tools = [
    {
        "type": "function",
        "function": {
            "name": "getMeme",
            "description": "return a meme in png form by providing the meme_template_id, upper_text and lower_text",
            "parameters": {
                "type": "object",
                "properties": {
                    "meme_template_id": {
                        "type": "string",
                        "description": "Name of the meme template"
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
                "required": ["meme_template_id"]
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
            "the id of the template must absolutely exist in the json array below that contains the id, name, sentiment and useCase of many meme templates. It is your task to know which template the user is refering to, by comparing the description to the names and ids, and return the corresponding id."
            "If the user does not refer to a specific template but rather describes a feeling or sentiment, you can refer to the fields sentiments and useCase to make a convenient choice and return the id."
            "For example, if the user says 'I want a meme of the crazy alien dude' it is your task to know they're refering to the ancient aliens guy, so you return 'aag' as the id of the meme template."
            "Here is the Json of all the memes:\n\n" + templates},
            {"role": "user", "content": prompt}
        ],
        tools=tools,
        tool_choice="auto"
    )
    tool_calls = response.choices[0].message.tool_calls
    if tool_calls:
        for call in tool_calls:
            if call.function.name == "getMeme":
                print("Meme tool call successfull")
                args = json.loads(call.function.arguments)
                print(args)
                return ResponseData(id=args["meme_template_id"], lines=[args["upper_text"], args["lower_text"]])
        return ResponseData(id="", lines=[])