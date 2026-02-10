# Accent-Web

This is a tool that aims to provide Japanese learners a tool to add furigana and accent marks to articles.

## Features

- Adds furigana and accent marks automatically to Japanese plain text, which can also be edited manually
- The formatted text can be copied as html format to render on HackMD with our HackMD Japanese accent marking css snippet `@OrangeSagoCream/AccentMarker`, or be downloaded as .pdf or .png file

## Installation

Install all packages with [bun](https://bun.com/):

```bash
bun i
```

## Set up dev server

Setup your `.env` file with the required API key:

```
VITE_X_API_KEY=<our_api_key>
```

Then start the development server:

```bash
bun dev
```
