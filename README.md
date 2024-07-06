# AI Text Summarizer

This is an [AI Text Summarizer](https://ai-text-summarizer.fly.dev/) application powered by Platformatic AI-warp and React (Vite). Platformatic AI-warp handles authentication via GitHub OAuth2 and processes AI prompts, while the React.js frontend application provides a user-friendly interface for summarzing texts.

## Requirements

Platformatic supports macOS, Linux and Windows ([WSL](https://docs.microsoft.com/windows/wsl/) recommended).
You'll need to have [Node.js](https://nodejs.org/) >= v18.8.0 or >= v20.6.0

## Setup

1. Install dependencies:

```bash
npm install
```

## Usage

Run the API with:

```bash
npm start
```

## Running the Dockerfile 

1. Build the Docker image with:

```
docker build -t text-summarizer-app .
```

2. Run the Docker container with environment variables:

```
docker run --env-file .env -p 3042:3042 text-summarizer-app
```