import { useEffect, useState } from "react";
import "./TrackTracker.css";

export default function TrackTracker() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trackPath = "M 40 250 C 40 300, 80 320, 100 300 L 220 180 C 240 160, 260 160, 280 170 L 320 190 C 350 200, 380 180, 380 150 C 380 120, 350 100, 320 100 L 250 80 C 230 70, 210 50, 200 30 C 180 0, 150 0, 130 20 L 60 120 C 40 150, 40 200, 40 250 Z";

  return (
    <div className="track-tracker-container">
      <svg viewBox="0 0 400 350" className="track-svg">
        <path d={trackPath} className="track-bg" />
        <path
          d={trackPath}
          className="track-progress"
          pathLength="100"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 - (scrollProgress * 100)
          }}
        />
      </svg>
    </div>
  );
}