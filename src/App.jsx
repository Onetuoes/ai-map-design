import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import axios from "axios";

import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2FuZ3R1b3R1byIsImEiOiJjbTYzcmU0aHgxYzdqMmlyNHN0eDlvOXFsIn0.Aj7pO1ilQY5CeBlCYyvYvw";

function App() {
  const mapContainerRef = useRef();
  const [map, setMap] = useState();
  const [style, setStyle] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState();

  /* const checkModels = async () => {
    try {
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          Authorization: Bearer ${import.meta.env.VITE_OPENAI_KEY},
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  checkModels();

  const requestGPT4 = async () => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'user', content: 'Hello, GPT-4!' },
        ],
      },
      {
        headers: {
          Authorization: Bearer ${import.meta.env.VITE_OPENAI_KEY},
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('GPT-4 response:', response.data);
  } catch (error) {
    console.error('Error with GPT-4 request:', error.response?.data || error.message);
  }
};

  requestGPT4(); */

  useEffect(() => {
    if (!map && mapContainerRef.current) {
      const initMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [11.576646, 48.134261],
        zoom: 12,
      });
      setMap(initMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  useEffect(() => {
    if (map && style) {
      map.setStyle(style);
    }
  }, [style, map]);

  useEffect(() => {
    if (!loading) {
      console.log("Finished loading.");
    }
  }, [loading]);

  useEffect(() => {
    if (params && map) {
      updateMapStyle(params);
    }
  }, [params, map]);

  useEffect(() => {
    if (imageUrl) {
      fetchParams(imageUrl);
    }
  }, [imageUrl]);

  // upload image in cloudinary and generate a URL in real-time
  const imageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "wangtuotuo");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dxtryblcn/image/upload",
          formData
        );
        const imageUrl = res.data.secure_url;
        setImageUrl(imageUrl);
      } catch (error) {
        console.error("No image uploaded.", error);
        alert("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchParams = async (imageUrl) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          /* can also use gpt-4o-turbo for better functionality here,
          gpt-4o-mini is much cheaper with unstable functionality. */
          model: "gpt-4o-mini-2024-07-18",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that generates color and width parameters for Mapbox style layers. 
              You will be given an image and its color palette. Your task is to generate only the following parameters for each layer:
              - background: { color } 
              - park: { color }
              - water: { color }
              - building: { color }
              - major_roads: { color, width }
              - minor_roads: { color, width }
              - road_labels: { color, halo_color, text_size }
              Rules:
              1. Use hex color codes (e.g., "#ffffff") for colors.
              2. Use numeric values (e.g., 2) for widths and text_size.
              3. Respond only with a valid JSON object, without any additional text or explanation.`,
            },
            {
              role: "user",
              content: `Generate color and width parameters for Mapbox style layers based on the colors of the given image.
              Please focus on the main color palette of the given image.
              Image: ${imageUrl}.
              Respond only with a valid JSON object, without any additional text or explanation.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const params = JSON.parse(response.data.choices[0].message.content);
      setParams(params);
      console.log("Received params: ", params);
      console.log(response);
      console.log(response.data);
      console.log(response.data.choices);
    } catch (error) {
      console.error(
        "Error generating Mapbox style:",
        error.response?.data || error.message
      );
      alert("Failed to generate JSON file. Please try again.");
    }
  };

  // assign parameters to corresponding keys
  const updateMapStyle = (params) => {
    const mapboxStyle = {
      version: 8,
      name: "Untitled",
      center: [11.576646, 48.134261],
      zoom: 12,
      bearing: 0,
      pitch: 0,
      imports: [{ id: "basemap", url: "mapbox://styles/mapbox/standard" }],
      sources: {
        composite: {
          url: "mapbox://mapbox.mapbox-streets-v8",
          type: "vector",
        },
      },
      sprite:
        "mapbox://sprites/wangtuotuo/cm334322k002i01pd3inu4a1s/8cfd3drho5eet9n336g32nhhr",
      glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
      projection: { name: "globe" },

      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": params.background.color,
          },
        },
        {
          id: "park",
          type: "fill",
          source: "composite",
          "source-layer": "landuse",
          filter: ["==", "class", "park"],
          paint: {
            "fill-color": params.park.color,
            "fill-opacity": 0.7,
          },
        },
        {
          id: "water",
          type: "fill",
          source: "composite",
          "source-layer": "water",
          paint: {
            "fill-color": params.water.color,
          },
        },
        {
          id: "minor_roads",
          type: "line",
          source: "composite",
          "source-layer": "road",
          filter: [
            "match",
            ["get", "class"],
            ["primary", "secondary", "tertiary", "residential"],
            false,
            true,
          ],
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": params.minor_roads.color,
            "line-width": params.minor_roads.width,
          },
        },
        {
          id: "major_roads",
          type: "line",
          source: "composite",
          "source-layer": "road",
          filter: [
            "match",
            ["get", "class"],
            ["primary", "secondary", "tertiary", "residential"],
            true,
            false,
          ],
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": params.major_roads.color,
            "line-width": params.major_roads.width,
          },
        },
        {
          id: "building",
          type: "fill",
          source: "composite",
          "source-layer": "building",
          paint: {
            "fill-color": params.building.color,
            "fill-opacity": 0.9,
          },
        },
        {
          id: "road_labels",
          type: "symbol",
          source: "composite",
          "source-layer": "road",
          filter: [
            "match",
            ["get", "class"],
            ["primary", "secondary", "tertiary", "residential"],
            true,
            false,
          ],
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Offc Pro Medium"],
            "text-size": params.road_labels.text_size,
            "symbol-placement": "line",
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color": params.road_labels.color,
            "text-halo-color": params.road_labels.halo_color,
            "text-halo-width": 0.9,
          },
        },
      ],
    };

    console.log("mapstyle:", mapboxStyle);
    setStyle(mapboxStyle);
  };

  // website deisgn
  return (
    <div>
      <div
        style={{
          background: "#D0E8D0",
          padding: 15,
          borderRadius: 5,
          boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          gap: "10px",
          width: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            flexWrap: "nowrap",
            alignItems: "baseline",
          }}
        >
          <h2
            style={{
              fontSize: "50px",
              margin: 0,
            }}
          >
            AI Map Design
          </h2>

          <h2
            style={{
              fontSize: "20px",
              marginLeft: "30px",
            }}
          >
            Qijia Wang
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "left",
            justifyContent: "left",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={imageUpload}
            style={{
              padding: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          />

          <button
            onClick={() =>
              imageUrl
                ? fetchParams(imageUrl)
                : console.log("No image uploaded.")
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "white",
              border: "none",
              borderRadius: "4px",
              whiteSpace: "nowrap",
            }}
          >
            Update Map Style
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <button
            onClick={() =>
              imageUrl
                ? fetchParams(imageUrl)
                : console.log("No image uploaded.")
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#A7C6C6",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Change Map Style
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                major_roads: {
                  ...prev.major_roads,
                  width: prev.major_roads.width + 1,
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#D2BA9C",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Major Road Width +
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                major_roads: {
                  ...prev.major_roads,
                  width: Math.max(1, prev.major_roads.width - 1),
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#D2BA9C",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Major Road Width -
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                minor_roads: {
                  ...prev.minor_roads,
                  width: prev.minor_roads.width + 1,
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#B0C4DE",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Minor Road Width +
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                minor_roads: {
                  ...prev.minor_roads,
                  width: Math.max(1, prev.minor_roads.width - 1),
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#B0C4DE",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Minor Road Width -
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                road_labels: {
                  ...prev.road_labels,
                  text_size: prev.road_labels.text_size + 2,
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#8F7D92",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Road label size +
          </button>

          <button
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                road_labels: {
                  ...prev.road_labels,
                  text_size: Math.max(1, prev.road_labels.text_size - 2),
                },
              }))
            }
            style={{
              padding: "8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#8F7D92",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Road label size -
          </button>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        style={{
          width: "100vw",
          height: "90vh",
        }}
      />
    </div>
  );
}

export default App;
