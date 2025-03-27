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
  const [activeLink, setActiveLink] = useState<string>(""); // Track the active link

  return (
    <div
      className={`overlay ${isProjectsActive ? "expanded" : ""}`} // Add a class when expanded
      style={{ color: font_color, backgroundColor: panel_color }}
    >
      <h1>Rowan Meyer</h1>
      <h2>Software Engineer</h2>
      <Link
        to="#"
        className={`nav-link ${activeLink === "about" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          navcallback("about");
          setActiveLink("about"); // Set active link
          navigate("/");
          setIsProjectsActive(false); // Collapse if navigating away
        }}
      >
        About
      </Link>
      <Link
        to="#"
        className={`nav-link ${activeLink === "cv" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          navcallback("cv");
          setActiveLink("cv"); // Set active link
          navigate("/cv");
          setIsProjectsActive(false); // Collapse if navigating away
        }}
      >
        CV
      </Link>

      <Link
        to="#"
        className={`nav-link ${activeLink === "projects" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          navcallback("projects");
          setActiveLink("projects"); // Set active link
          navigate("/projects");
          setIsProjectsActive(true); // Expand when "Projects" is active
        }}
      >
        Projects
      </Link>
      {isProjectsActive && (
        <div className="sub-links">
          <a
            className={`nav-link ${activeLink === "subrogue" ? "active" : ""}`}
            href="https://github.com/BluntBSE/subrogue-1"
            onClick={() => setActiveLink("subrogue")}
          >
            SubRogue
          </a>
          <a
            className={`nav-link ${
              activeLink === "geodatabase" ? "active" : ""
            }`}
            href="https://github.com/BluntBSE/multiprocessing_for_arcmap_and_pro"
            onClick={() => setActiveLink("geodatabase")}
          >
            GeodataBase Multiprocessing
          </a>
          <a
            className={`nav-link ${
              activeLink === "songinspector" ? "active" : ""
            }`}
            href="https://github.com/BluntBSE/song-inspector"
            onClick={() => setActiveLink("songinspector")}
          >
            SongInspector
          </a>
        </div>
      )}

      <a
        href="mailto:to.rowan.meyer@gmail.com"
        target="_blank"
        className={`nav-link ${activeLink === "email" ? "active" : ""}`}
        onClick={() => setActiveLink("email")}
      >
        Email
      </a>
    </div>
  );
}

export default Navigation;
