# AI-assisted Map Design & Real-time Rendering

An interactive web tool that leverages AI to assist in map style design. By analyzing reference images or textual descriptions, it generates Mapbox-compatible styles and renders them in real time for immediate preview.

## Features

- **Image-driven style extraction**: Upload a design reference image to automatically extract style elements such as colors, layers, and layout.
- **Mapbox style JSON generation**: Convert extracted information into a valid Mapbox style schema.
- **Real-time rendering**: Instantly preview the generated map style using Mapbox GL JS.
- **Simple revision**: Make improvements by simply clicking the buttons.
- **React + OpenAI integration**: Combines GPT’s language processing power with an intuitive React-based UI.

## Tech Stack

- **Frontend**: React + Vite
- **Map rendering**: Mapbox GL JS
- **Image processing / feature extraction**: OpenAI GPT API
- **Schema file generation**: OpenAI GPT API
- **Version Control**: Git + GitHub

## Main Structure 

```markdown
├── public/  
├── node_modules/  
├── src/  
│   ├── assets/  
│   ├── App.css  
│   ├── index.css  
│   ├── App.jsx             # Main app logic  
│   └── main.jsx            # Entry point  
├── .env                    # API key config (not uploaded)  
└── README.md
```
## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Onetuoes/ai-map-design.git
cd ai-map-design
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up your API key**
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```bash
Visit http://localhost:5173 to view the app.
```
