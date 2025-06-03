# Hackdays 2025 - Team Onepoint

This project is a collaborative hackathon application developed by Team Onepoint for Hackdays 2025. It features meme generation using AI, collaborative drawing rooms, and asset management.

## Features

- **AI Meme Generation**: Generate memes from text prompts or templates using an AI service and external meme APIs.
- **Room Collaboration**: Create, save, and load collaborative drawing rooms.
- **Asset Management**: Upload and retrieve assets (such as images) for use in rooms and memes.

## Project Structure

```
back-albert/        # Backend to interact with AlbertAI.
back/               # Backend services and APIs
  models/           # TypeScript models (e.g., MemeTemplate, MemePromptResponse)
  services/         # Core service logic (AI, meme generation, room storage)
front/              # Frontend application (if present)
README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js >=v24 recommended
- npm
- (Optional) Docker

### Environment Variables

Create a `.env` file in the `back/` directory with the following variables:

```
MEMEGEN_API_URL=https://api.memegen.link
AI_API_URL=https://your-ai-api-url
ROOM_DIR=./data/rooms
ASSET_DIR=./data/assets
```

### Install Dependencies

```bash
cd back
npm install
```

## Running the Python AI Backend (`back-albert`) with venv and Uvicorn

The `back-albert` directory contains a Python FastAPI backend used for AI-powered meme prompt processing.

### Setting Up a Python Virtual Environment

1. **Create a virtual environment:**

    ```bash
    python3 -m venv venv
    ```

2. **Activate the virtual environment:**

    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```

3. **Install Python dependencies:**

    ```bash
    pip3 install -r requirements.txt
    ```

4. **Create a `vars.py` file in the `back-albert` directory with your API key:**

    ```python
    ALBERT_API_KEY = "Key"
    ```

    Replace `"Key"` with your actual API key.

### Running the FastAPI App with Uvicorn

From the `back-albert` directory, start the server with:

```bash
uvicorn test_albert:app --reload
```

- `test_albert:app` refers to the `app` object in the `test_albert.py` file.
- The `--reload` flag enables auto-reloading on code changes (recommended for development).

---

### Running the Backend

```bash
$ npm run start
```

### Running the Frontend

If a frontend exists, follow the instructions in the `front/` directory.

## API Overview

### Meme Generation

- `POST /memes/prompt` - Generate a meme from a text prompt.
- `GET /memes/templates` - List available meme templates.
- `GET /memes/templates/:id` - Get a specific meme template.

### Room Storage

- `GET /rooms/:id` - Load a room snapshot.
- `POST /rooms/:id` - Save a room snapshot.

### Asset Management

- `POST /assets/:id` - Upload an asset.
- `GET /assets/:id` - Download an asset.

## Technologies Used

- TypeScript
- Node.js
- Fastify
- External APIs (memegen.link, custom AI service)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License

MIT

---

*Made with ❤️ by Team Onepoint for Hackdays 2025*