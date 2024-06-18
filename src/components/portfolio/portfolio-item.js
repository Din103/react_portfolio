//Este componente de clase ha sido modificado a componente funcional por chatgpt

import React, { useState } from "react";
import { Link } from "react-router-dom";

const PortfolioItem = (props) => {
  // Inicializa el estado con useState
  const [portfolioItemClass, setPortfolioItemClass] = useState("");

  // Maneja el evento cuando el ratón entra en el componente
  const handleMouseEnter = () => {
    // Cambia la clase CSS para aplicar un efecto de desenfoque
    setPortfolioItemClass("image-blur");
  };

  // Maneja el evento cuando el ratón sale del componente
  const handleMouseLeave = () => {
    // Restaura la clase CSS a su estado original (sin desenfoque)
    setPortfolioItemClass("");
  };

  // Desestructura las propiedades del portafolio desde los props
  const { id, description, thumb_image_url, logo_url } = props.item;
  
  return (
    // Enlace que navega a la página del portafolio según su id
    <Link to={`/portfolio/${id}`}>
      <div
        className="portfolio-item-wrapper"
        // Asigna los manejadores de eventos para mouse enter y leave
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Contenedor de la imagen del portafolio con fondo y clase dinámica */}
        <div
          className={"portfolio-img-background " + portfolioItemClass}
          style={{
            backgroundImage: "url(" + thumb_image_url + ")"
          }}
        />

        {/* Contenedor del texto y el logo */}
        <div className="img-text-wrapper">
          {/* Logo del portafolio */}
          <div className="logo-wrapper">
            <img src={logo_url} alt="Portfolio logo"/>
          </div>

          {/* Descripción del portafolio */}
          <div className="subtitle">{description}</div>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioItem;
