// src/components/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './home.css';
import Ai from "../assets/ai.mp4"
const Home = () => {
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [textStyle, setTextStyle] = useState({
    color: '#000000',
    fontSize: '16px',
    fontFamily: 'Arial',
    stroke: 'none'
  });
  const videoRef = useRef(null);

  const addTextBox = () => {
    const newText = {
      id: Date.now(),
      text: 'New Text',
      x: 10,
      y: 10,
      width: 200,
      height: 50,
      style: { ...textStyle }
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
    setPosition({ x: newText.x, y: newText.y });
  };

  const updateText = (id, newText) => {
    setTexts(texts.map(text => text.id === id ? { ...text, text: newText } : text));
  };

  const updateTextStyle = (id, style) => {
    setTexts(texts.map(text => text.id === id ? { ...text, style: { ...text.style, ...style } } : text));
  };

  const deleteText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const onVideoPlay = () => {
    texts.forEach(text => {
      // Additional logic to handle text synchronization with video can go here.
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('play', onVideoPlay);
    }
    return () => {
      if (video) {
        video.removeEventListener('play', onVideoPlay);
      }
    };
  }, [texts]);

  const handleDragStop = (e, d, id) => {
    const updatedTexts = texts.map(t => t.id === id ? { ...t, x: d.x, y: d.y } : t);
    setTexts(updatedTexts);
    if (id === selectedTextId) {
      setPosition({ x: d.x, y: d.y });
    }
  };

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    const newPosition = { ...position, [name]: parseInt(value, 10) || 0 };
    setPosition(newPosition);

    const updatedTexts = texts.map(text =>
      text.id === selectedTextId ? { ...text, ...newPosition } : text
    );
    setTexts(updatedTexts);
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    const newStyle = { ...textStyle, [name]: name === 'fontSize' ? `${value}px` : value };
    setTextStyle(newStyle);

    const updatedTexts = texts.map(text =>
      text.id === selectedTextId ? { ...text, style: { ...text.style, [name]: newStyle[name] } } : text
    );
    setTexts(updatedTexts);
  };

  const handleSelectTextBox = (id) => {
    const selectedText = texts.find(text => text.id === id);
    if (selectedText) {
      setSelectedTextId(id);
      setPosition({ x: selectedText.x, y: selectedText.y });
      setTextStyle(selectedText.style);
    }
  };

  return (
    <div className="home-container">
      <div className="video-section">
        <video ref={videoRef} width="700" autoPlay controls>
          <source src={Ai} type="video/mp4" />
        </video>
        {texts.map(text => (
          <Rnd
            key={text.id}
            position={{ x: text.x, y: text.y }}
            size={{ width: text.width, height: text.height }}
            onDragStop={(e, d) => handleDragStop(e, d, text.id)}
            onResizeStop={(e, direction, ref, delta, position) => setTexts(texts.map(t => t.id === text.id ? { ...t, width: ref.offsetWidth, height: ref.offsetHeight, ...position } : t))}
            onClick={() => handleSelectTextBox(text.id)}
          >
            <div className="text-box" style={{ ...text.style }}>
              <input
                type="text"
                value={text.text}
                onChange={(e) => updateText(text.id, e.target.value)}
                style={{ width: '100%', height: '100%', ...text.style }}
              />
              <span className="delete-icon" onClick={() => deleteText(text.id)}>❌</span>
            </div>
          </Rnd>
        ))}
      </div>
      <div className="config-section">
        <button className="add-text-button" onClick={addTextBox}>Add Text</button>
        <div className="config-box">
          <div className="text-style-box">
            <label>
              Color:
              <input
                type="color"
                name="color"
                value={textStyle.color}
                onChange={handleStyleChange}
              />
            </label>
            <label>
              Font Size:
              <input
                type="number"
                name="fontSize"
                value={parseInt(textStyle.fontSize)}
                onChange={handleStyleChange}
              />
            </label>
            <label>
              Font Family:
              <select name="fontFamily" value={textStyle.fontFamily} onChange={handleStyleChange}>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Palatino">Palatino</option>
                <option value="Garamond">Garamond</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Monaco">Monaco</option>
              </select>
            </label>
            <label>
              Stroke:
              <input
                type="text"
                name="stroke"
                value={textStyle.stroke}
                onChange={handleStyleChange}
              />
            </label>
          </div>
          <div className="position-config-box">
            <label>
              X:
              <input
                type="number"
                name="x"
                value={position.x}
                onChange={handlePositionChange}
              />
            </label>
            <label>
              Y:
              <input
                type="number"
                name="y"
                value={position.y}
                onChange={handlePositionChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
