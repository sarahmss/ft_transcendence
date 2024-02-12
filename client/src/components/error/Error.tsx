import React from "react";
import img from "../../assets/error.jpg"

const Error: React.FC = () => {
  const messageStyle: React.CSSProperties = {
    color: "#6a0572", // Cor do texto roxo
    backgroundColor: "#e3d7f1", // Cor de fundo roxa claro
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Sombra suave
    marginTop: "20px",
    textAlign: "center"
  };

  const imgStyle: React.CSSProperties = {
    display: "block",
    margin: "auto",
  };


  return (
    <div>
      <p style={messageStyle}>Error: Something went wrong!</p>
      <img style={imgStyle} src={img}/>
    </div>
  );
};

export default Error;