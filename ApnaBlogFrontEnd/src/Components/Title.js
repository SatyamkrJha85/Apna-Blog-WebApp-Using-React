import React from "react";
import ReactLogo from "./ReactLogo";
import SpringLogo from "./SpringLogo";
import RestApiLogo from "./RestApiLogo";

const Title = () => {
  return (
    <div className="btn" style={{ cursor: "default" }}>
      <h4>
        <span
          className="ms-1"
          style={{
            fontWeight: "bold",
            textShadow: "2px 2px 3px rgb(150, 150, 150)",
          }}
        >
          Apna Blog
        </span>
     
     
       
        {/* <span
          className="ms-1"
          style={{
            fontWeight: "bold",
            textShadow: "2px 2px 3px rgb(150, 150, 150)",
          }}
        >
          By Satyam
        </span> */}
      </h4>
    </div>
  );
};

export default Title;
