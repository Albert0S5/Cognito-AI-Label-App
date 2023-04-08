import './App.css';
import React, {useState} from 'react';

import { Predictions } from 'aws-amplify'

function App() {

  const [response, setResponse] = useState("")
  const [imageUrl, setImageUrl] = useState(null);
  const [tagElements, setTagElements] = useState(null);

  async function identify(event) {
    setResponse("loading...");
    const { target: { files } } = event;
    const file = files[0];
    try {
      const response = await Predictions.identify({
        labels: {
          source: {
            file,
          },
          type: "ALL"
        }
      });
      const { labels } = response;
      const { unsafe } = response;
      const labelStrings = labels.map(object => {
        
      const { name } = object;

      const tagStyle = {
        color:"#121212",
        backgroundColor: "#e0e0e0",
        padding: "6px 12px",
        margin: "5px",
        borderRadius: "5px",
        display: "inline-block"
      };
      if(object.metadata.confidence > 70){
        return (
          <div style={tagStyle}>
            <p style={{ margin: 0 }}>{name}</p>
          </div>
        );
      }
    });
      setTagElements(labelStrings);
      setResponse("Unsafe? = " + unsafe);
      setImageUrl(URL.createObjectURL(file));
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className="App">
      <label for="image">
        Upload Picture
        <input type="file" id="image" onChange={identify}  />
      </label>
      <div id="container">
        {imageUrl && <img src={imageUrl} alt="uploaded image"/>} 
        <div>{tagElements}</div>
        <div id="unsafe"><p>{response}</p></div>
        </div>
      </div>
  );
}

export default App;
