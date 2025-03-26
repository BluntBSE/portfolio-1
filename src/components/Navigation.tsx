import { NavLink } from "react-router-dom";

interface NavigationProps {
  font_color: string;
  panel_color: string;
}

function Navigation({ font_color, panel_color }: NavigationProps) {
  return (
    <div
      className="overlay"
      style={{ color: font_color, backgroundColor: panel_color }}
    >
      <h1>Rowan Meyer</h1>
      <h2>Software Engineer</h2>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        About
      </NavLink>
      <NavLink
        to="/tools"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Tools
      </NavLink>
      <NavLink
        to="/projects"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Projects
      </NavLink>
      <NavLink
        to="/cv"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        CV
      </NavLink>
    </div>
  );
}

export default Navigation;
