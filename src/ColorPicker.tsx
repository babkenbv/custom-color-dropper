import React, { useRef, useState, useEffect, MouseEvent } from "react";

const circleSize = 100;
const strokeWidth = 10;

const ColorDropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDropperActive, setIsDropperActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const [pickedColor, setPickedColor] = useState("#FFFFFF");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = "canvas.jpg";
      }
    }
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDropperActive) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCursorPosition({ x: event.clientX, y: event.clientY });

      const context = canvas.getContext("2d");
      if (context) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        setCurrentColor(hex);
      }
    }
  };

  const handleClick = () => {
    setPickedColor(currentColor);
    setIsDropperActive(false);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <div>
      <header className="header">
        <button
          className="colorPickerButton"
          onClick={() => setIsDropperActive(true)}
        >
          <img
            className="eyedropperIcon"
            src="IconColorPicker.svg"
            alt="Eyedropper"
          />
        </button>
        {pickedColor}
      </header>
      <div className="container">
        <canvas
          className="canvas"
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          style={{
            cursor: isDropperActive ? "crosshair" : "default",
          }}
        />
        {isDropperActive && (
          <div
            style={{
              position: "fixed",
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <svg
              width={circleSize}
              height={circleSize}
              viewBox={`0 0 ${circleSize} ${circleSize}`}
            >
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={circleSize / 2 - strokeWidth / 2}
                fill="white"
                stroke={currentColor}
                strokeWidth={strokeWidth}
                opacity="0.5"
              />
              <text
                className="tooltipText"
                x="50%"
                y="70%"
                fill="black"
                fontSize="11"
                fontFamily="Arial"
                textAnchor="middle"
                alignmentBaseline="central"
              >
                {currentColor}
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorDropper;
