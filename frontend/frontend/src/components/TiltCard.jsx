import { useRef, useState } from "react";
import "./TiltCard.css";

export default function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const rotateX = (0.5 - y) * 20; 
    const rotateY = (x - 0.5) * 20;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      "--glare-x": `${x * 100}%`,
      "--glare-y": `${y * 100}%`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      "--glare-x": "50%",
      "--glare-y": "50%"
    });
  };

  return (
    <section
      className={`tilt-card-wrapper ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <div className="tilt-card-glare"></div>
      <div className="tilt-card-content">{children}</div>
    </section>
  );
}