//Este componente de clase ha sido modificado a componente funcional por chatgpt

import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioDetail = (props) => {
  // Estado inicial para almacenar los detalles del portafolio
  const [portfolioItem, setPortfolioItem] = useState({});

  // Hook de efecto que se ejecuta antes de montar el componente
  useEffect(() => {
    // Llama al método para obtener los detalles del portafolio
    getPortfolioItem();
  }, []);

  // Método para obtener los detalles del portafolio desde la API
  const getPortfolioItem = () => {
    axios
      .get(
        // URL de la API con el slug del portafolio pasado como parámetro
        `https://jordan.devcamp.space/portfolio/portfolio_items/${props.match.params.slug}`,
        { withCredentials: true } // Incluye credenciales para la autenticación
      )
      .then((response) => {
        // Maneja la respuesta de la API y actualiza el estado con los datos recibidos
        setPortfolioItem(response.data.portfolio_item);
      })
      .catch((error) => {
        // Maneja cualquier error que ocurra durante la solicitud
        console.log("getportfolioitem error", error);
      });
  };

  // Extrae los detalles del portafolio desde el estado
  const {
    banner_image_url,
    category,
    description,
    logo_url,
    name,
    thumb_image_url,
    url,
  } = portfolioItem;

  // Define los estilos para el banner usando la URL de la imagen del banner
  const bannerStyles = {
    backgroundImage: "url(" + banner_image_url + ")",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  };

  // Define los estilos para el logo, estableciendo un ancho fijo
  const logoStyles = {
    width: "200px",
  };

  return (
    // Contenedor principal del detalle del portafolio
    <div className="portfolio-detail-wrapper">
      {/* Sección del banner con los estilos aplicados */}
      <div className="banner" style={bannerStyles}>
        {/* Imagen del logo dentro del banner */}
        <img src={logo_url} style={logoStyles} />
      </div>

      {/* Contenedor para la descripción del portafolio */}
      <div className="portfolio-detail-description-wrapper">
        <div className="description">{description}</div>
      </div>

      {/* Contenedor para la parte inferior con el enlace al sitio */}
      <div className="bottom-content-wrapper">
        <a href={url} className="site-link" target="_blank">
          Visit {name}
        </a>
      </div>
    </div>
  );
};

export default PortfolioDetail;
