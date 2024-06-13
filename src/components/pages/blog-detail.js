import React, { Component } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

import BlogForm from "../blog/blog-form";
import BlogFeaturedImage from "../blog/blog-featured-image";

// Definición del componente BlogDetail
export default class BlogDetail extends Component {
  constructor(props) {
    super(props);

    // Estado inicial del componente
    this.state = {
      currentId: this.props.match.params.slug, // ID del blog actual
      blogItem: {}, // Detalles del blog
      editMode: false // Modo de edición desactivado por defecto
    };
    // Enlazar métodos al contexto del componente
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleFeaturedImageDelete = this.handleFeaturedImageDelete.bind(this);
    this.handleUpdateFormSubmission = this.handleUpdateFormSubmission.bind(this);
  }
  // Maneja la actualización del formulario
  handleUpdateFormSubmission(blog) {
    this.setState({
      blogItem: blog, // Actualiza el blogItem con los nuevos datos
      editMode: false // Desactiva el modo de edición
    });
  }
  // Maneja la eliminación de la imagen destacada
  handleFeaturedImageDelete() {
    this.setState({
      blogItem: {
        ...this.state.blogItem, // Mantiene el resto de las propiedades
        featured_image_url: "" // Elimina la URL de la imagen destacada
      }
    });
  }
  // Maneja el clic en el botón de edición
  handleEditClick() {
    if (this.props.loggedInStatus === "LOGGED_IN") {
      this.setState({ editMode: true }); // Activa el modo de edición si el usuario está logueado
    }
  }
  // Obtiene los detalles del blog desde la API
  getBlogItem() {
    axios
      .get(`https://jordan.devcamp.space/portfolio/portfolio_blogs/${this.state.currentId}`)
      .then(response => {
        this.setState({
          blogItem: response.data.portfolio_blog // Actualiza el estado con los datos del blog
        });
      })
      .catch(error => {
        console.log("getBlogItem error", error); // Maneja cualquier error en la solicitud
      });
  }

  // Ejecuta la obtención de datos del blog cuando el componente se monta
  componentDidMount() {
    this.getBlogItem();
  }
  render() {
    const {
      title,
      content,
      featured_image_url,
      blog_status
    } = this.state.blogItem;

    // Función para gestionar el contenido a mostrar
    const contentManager = () => {
      if (this.state.editMode) {
        // Muestra el formulario de edición si el modo de edición está activado
        return (
          <BlogForm
            handleFeaturedImageDelete={this.handleFeaturedImageDelete}
            handleUpdateFormSubmission={this.handleUpdateFormSubmission}
            editMode={this.state.editMode}
            blog={this.state.blogItem}
          />
        );
      } else {
        // Muestra los detalles del blog si el modo de edición está desactivado
        return (
          <div className="content-container">
            <h1 onClick={this.handleEditClick}>{title}</h1>
            <BlogFeaturedImage img={featured_image_url} />
            <div className="content">{ReactHtmlParser(content)}</div>
          </div>
        );
      }
    };
    // Renderiza el componente BlogDetail
    return <div className="blog-container">{contentManager()}</div>;
  }
}
