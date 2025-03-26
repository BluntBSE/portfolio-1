import { Link, useNavigate } from "react-router-dom";

interface NavigationProps {
  font_color: string;
  panel_color: string;
  navcallback: (panel: string) => void;
}

function Navigation({ font_color, panel_color, navcallback }: NavigationProps) {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <div
      className="overlay"
      style={{ color: font_color, backgroundColor: panel_color }}
    >
      <h1>Rowan Meyer</h1>
      <h2>Software Engineer</h2>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          navcallback("about"); // Trigger the callback
          navigate("/"); // Navigate programmatically
        }}
      >
        About
      </Link>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          navcallback("tools"); // Trigger the callback
          navigate("/tools"); // Navigate programmatically
        }}
      >
        Tools
      </Link>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          navcallback("projects"); // Trigger the callback
          navigate("/projects"); // Navigate programmatically
        }}
      >
        Projects
      </Link>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          navcallback("cv"); // Trigger the callback
          navigate("/cv"); // Navigate programmatically
        }}
      >
        CV
      </Link>
    </div>
  );
}

export default Navigation;
