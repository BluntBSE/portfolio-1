import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavigationProps {
  font_color: string;
  panel_color: string;
  navcallback: (panel: string) => void;
}

function Navigation({ font_color, panel_color, navcallback }: NavigationProps) {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [isProjectsActive, setIsProjectsActive] = useState(false); // Track if "Projects" is active

  return (
    <div
      className={`overlay ${isProjectsActive ? "expanded" : ""}`} // Add a class when expanded
      style={{ color: font_color, backgroundColor: panel_color }}
    >
      <h1>Rowan Meyer</h1>
      <h2>Software Engineer</h2>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          navcallback("about");
          navigate("/");
          setIsProjectsActive(false); // Collapse if navigating away
        }}
      >
        About
      </Link>
      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          navcallback("cv");
          navigate("/cv");
          setIsProjectsActive(false); // Collapse if navigating away
        }}
      >
        CV
      </Link>

      <Link
        to="#"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          navcallback("projects");
          navigate("/projects");
          setIsProjectsActive(true); // Expand when "Projects" is active
        }}
      >
        Projects
      </Link>
      {isProjectsActive && (
        <div className="sub-links">
          <Link
            to="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navcallback("subrogue");
              navigate("/projects/searogue");
            }}
          >
            SubRogue
          </Link>
          <Link
            to="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navcallback("geodatabase");
              navigate("/projects/geodatabase");
            }}
          >
            GeodataBase Multiprocessing
          </Link>
          <Link
            to="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navcallback("songinspector");
              navigate("/projects/songinspector");
            }}
          >
            SongInspector
          </Link>
        </div>
      )}

      <a href="mailto:to.rowan.meyer@gmail.com" className="nav-link">
        Email
      </a>
    </div>
  );
}

export default Navigation;
