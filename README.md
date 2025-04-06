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
   
Install npm.  
```bash
npm install
```

3. **Set up your API key**
  
Create your own .env file using your GPT API Key. For better performance, GPT-4o-turbo is recommended, while GPT-4o-mini is a more cost-effective option.  

4. **Start the development server**

Change to the directory where your repository is.   
```bash
npm run dev
```

5. **Open your browser**

Visit http://localhost:5173 to view the app.  

## Example



1. After opening the link, you will see the initial interface.  
  
![initial interface](https://github.com/Onetuoes/ai-map-design/blob/main/images/initial%20interface.png)



2. Next, click the `Choose File` button to select your map design material (it must be an image). For this example, I have chosen Van Gogh's "Starry Night".  
  
![image upload](https://github.com/Onetuoes/ai-map-design/blob/main/images/image%20upload.png)



3. Once the image is uploaded, click the `Update Map Style` button. The map will be rendered in real-time and will be displayed in a few seconds.  
  
![map initialization](https://github.com/Onetuoes/ai-map-design/blob/main/images/map%20initialization.png)



4. After the map is rendered, you can zoom in or out to adjust the view as needed. The detailed structure of buildings will appear as you zoom in to a certain scale. Additionally, you can move the selected area to change the focus of the map.  
  
![zoom in](https://github.com/Onetuoes/ai-map-design/blob/main/images/zoom%20in.png)



5. If you do not like the map style, just click the `Change Map Style` button until you get a satisfactory one.  
  
![change map style](https://github.com/Onetuoes/ai-map-design/blob/main/images/change%20map%20style.png)



6. After a preliminary map has been designed, you can click the buttons to make more detailed improvements.  
   For example, here is the map after increasing major road width.  
  
![broader road](https://github.com/Onetuoes/ai-map-design/blob/main/images/broader%20road.png)


  
   Here is the map after decreasing major road width.  
  
![narrower road](https://github.com/Onetuoes/ai-map-design/blob/main/images/narrower%20road.png)
  

## License

This project is licensed under the MIT License.  
  
## Contact

Feel free to reach out to me at qijia.wang@tum.de.  
  
