import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class PortfolioItem extends Component {
  constructor(props) {
    super(props);

    // Inicializa el estado con una clase CSS vacía
    this.state = {
      portfolioItemClass: ""
    };
  }

  // Maneja el evento cuando el ratón entra en el componente
  handleMouseEnter() {
    // Cambia la clase CSS para aplicar un efecto de desenfoque
    this.setState({ portfolioItemClass: "image-blur" });
  }

  // Maneja el evento cuando el ratón sale del componente
  handleMouseLeave() {
    // Restaura la clase CSS a su estado original (sin desenfoque)
    this.setState({ portfolioItemClass: "" });
  }

  render() {
    // Desestructura las propiedades del portafolio desde los props
    const { id, description, thumb_image_url, logo_url } = this.props.item;
    
    return (
      // Enlace que navega a la página del portafolio según su id
      <Link to={`/portfolio/${id}`}>
        <div
          className="portfolio-item-wrapper"
          // Asigna los manejadores de eventos para mouse enter y leave
          onMouseEnter={() => this.handleMouseEnter()}
          onMouseLeave={() => this.handleMouseLeave()}
        >
          {/* Contenedor de la imagen del portafolio con fondo y clase dinámica */}
          <div
            className={
              "portfolio-img-background " + this.state.portfolioItemClass
            }
            style={{
              backgroundImage: "url(" + thumb_image_url + ")"
            }}
          />

          {/* Contenedor del texto y el logo */}
          <div className="img-text-wrapper">
            {/* Logo del portafolio */}
            <div className="logo-wrapper">
              <img src={logo_url} />
            </div>

            {/* Descripción del portafolio */}
            <div className="subtitle">{description}</div>
          </div>
        </div>
      </Link>
    );
  }
}
