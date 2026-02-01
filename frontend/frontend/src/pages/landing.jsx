import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1>F1 Rating Project</h1>
      <p>Explore driver metrics and rankings</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/Home")}
      >
        View Graphs
      </button>
    </div>
  );
}
