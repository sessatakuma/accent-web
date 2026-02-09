# Accent-Web
This is a tool that aims to provide Janpanese learners a tool to add furigana and accent marks to articles.

## Features
- Adds furigana and accent marks autmatically to Japanese plain text, which can also be edited manually
- The formatted text can be copied as html format to render on HackMD with our HackMD Japanese accent marking css snippet `@OrangeSagoCream/AccentMarker`, or be downloaded as .pdf or .png file

## Prerequisites
- Node.js (v16+ recommended)

## Installation
Install all packages with npm:
```bash
npm install
```

## Run the app
Setup your `.env` file with the required API key:
```
X_API_KEY=<our_api_key>
```

Then start the development server:

```
npm run dev
```