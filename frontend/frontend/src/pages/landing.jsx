import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./landing.css";
import logoImg from "../assets/img2.png";
import rb9Model from "../assets/red_bull_rb9_f1__www.vecarz.com.glb";
import F1Loader from "../components/F1Loader"; 
import F1StartLoader from "../components/F1StartLoader";

export default function Landing() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false); 

  useEffect(() => {
    const scriptId = "model-viewer-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="landing-page">
      {isLaunching && <F1StartLoader />}

      <header className="landing-header">
        <div className="landing-logo">
          <img src={logoImg} alt="VelocityStats Logo" />
          <span>VelocityStats</span>
        </div>

        <div className="landing-auth-nav">
          <SignedOut>
            <button type="button" className="landing-secondary" onClick={() => navigate("/sign-in")}>
              Log In
            </button>
            <button type="button" className="landing-primary" onClick={() => navigate("/sign-up")}>
              Sign Up
            </button>
          </SignedOut>

          <SignedIn>
            <button type="button" className="landing-secondary" onClick={() => navigate("/selection")}>
              Open Dashboard
            </button>
            <div className="landing-user-button-wrap">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-text-section">
          <h1>
            Beyond Speed.<br />
            <span>Pure Driver Skill.</span>
          </h1>
          <div className="landing-accent-bar"></div>
          <p>
            Advanced Formula 1 analytics designed to separate driver brilliance
            from machinery dominance using non-standard performance metrics.
          </p>

          <div className="landing-cta">
            <button
              className="landing-primary"
              type="button"
              onClick={() => {
                setIsLaunching(true);
                setTimeout(() => navigate("/selection"), 3200);
              }}
            >
              Proceed to Selection
            </button>
          </div>

          <div className="landing-stats">
            <article className="landing-stat-card">
              <h3>Consistency Index</h3>
              <p>Lap-to-lap stability under race pressure</p>
            </article>
            <article className="landing-stat-card">
              <h3>Tyre Intelligence</h3>
              <p>Degradation control &amp; stint optimization</p>
            </article>
            <article className="landing-stat-card">
              <h3>Race IQ</h3>
              <p>Overtakes, defense &amp; situational awareness</p>
            </article>
          </div>
        </section>

        <div className="landing-model-container">
          <model-viewer
            src={rb9Model}
            auto-rotate
            rotation-per-second="-12deg"
            disable-zoom
            interaction-prompt="none"
            environment-image="neutral"
            shadow-intensity="1"
          ></model-viewer>
        </div>
      </main>

      <div className="landing-footer-line"></div>
    </div>
  );
}