import React from "react"; 
import "./Footer.css";
import {useLocation} from "react-router-dom";

const Footer = () => {
    const route = useLocation().pathname;
  return (
    <footer
      className="footer"
      style={route === "/" ? { background: "#3ea2b2" } : {}}
    >
      <p style={route !== "/"? {textShadow: "1px 1px 2px rgb(0 0 0)", color: "#fb8928"} : {}}>
        All Rights Reserved &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
