// NavBar.tsx
import "../css/NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* Right-aligned: brand + logo together, then links */}
        <div className="nav-right">
          <div className="brand-group">
            <img src="/light_pen_bulb.png" alt="logo" className="logo" />
            <Link to="/" className="brand">
              منصة حلول
            </Link>
          </div>

          <span className="divider"></span>
          <Link to="/" className="nav-home">
            الرئيسية
          </Link>

          <span className="divider"></span>
          <Link to="/complain" className="nav-complaint">
            قدم الشكوى
          </Link>

          <span className="divider"></span>
          <Link to="/about" className="nav-about">
            عن النظام
          </Link>

          <span className="divider"></span>
          <Link to="/contact" className="nav-contact">
            تواصل معنا
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
