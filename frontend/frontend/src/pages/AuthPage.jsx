import { Navigate, Link } from "react-router-dom";
import { SignedIn, SignIn, SignUp } from "@clerk/clerk-react";
import "./AuthPage.css";

export default function AuthPage({ mode = "sign-in" }) {
  const isSignIn = mode === "sign-in";

  return (
    <>
      <SignedIn>
        <Navigate to="/selection" replace />
      </SignedIn>

      <div className="auth-page">
        <div className="auth-overlay" />

        <header className="auth-header">
          <Link to="/" className="auth-brand">VelocityStats</Link>
          <Link to="/" className="auth-back-link">Back to Home</Link>
        </header>

        <main className="auth-main">
          <section className="auth-copy">
            <p className="auth-kicker">Pit Lane Access</p>
            <h1>{isSignIn ? "Log In to Tune Telemetry" : "Create Your Race Engineer Account"}</h1>
            <p>
              {isSignIn
                ? "Sign in to unlock custom metric weights and export your personalized standings."
                : "Sign up to save your race analysis flow and unlock telemetry weight controls."}
            </p>
          </section>

          <section className="auth-card">
            {isSignIn ? (
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
            ) : (
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            )}
          </section>
        </main>
      </div>
    </>
  );
}