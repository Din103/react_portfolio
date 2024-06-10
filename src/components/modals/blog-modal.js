import React, { Component } from "react";
import ReactModal from "react-modal";

import BlogForm from "../blog/blog-form";

// Establece el elemento raíz de la aplicación para ReactModal
ReactModal.setAppElement(".app-wrapper");

// Componente de clase BlogModal
export default class BlogModal extends Component {
  constructor(props) {
    super(props);

    // Estilos personalizados para la modal
    this.customStyles = {
      content: {
        top: "50%",               // Posición vertical centrada
        left: "50%",              // Posición horizontal centrada
        right: "auto",            // Ajuste automático del margen derecho
        marginRight: "-50%",      // Margen derecho negativo para centrado
        transform: "translate(-50%, -50%", // Transformación para centrado
        width: "800px"            // Ancho fijo de la modal
      },
      overlay: {
        backgroundColor: "rgba(1, 1, 1, 0.75)" // Color de fondo del overlay
      }
    };

    // Enlace de método al contexto del componente
    this.handleSuccessfullFormSubmission = this.handleSuccessfullFormSubmission.bind(
      this
    );
  }

  // Método que maneja la sumisión exitosa del formulario del blog
  handleSuccessfullFormSubmission(blog) {
    this.props.handleSuccessfulNewBlogSubmission(blog);
  }

  // Renderizado del componente
  render() {
    return (
      <ReactModal
        style={this.customStyles}  // Estilos personalizados de la modal
        onRequestClose={() => {
          this.props.handleModalClose(); // Manejador de cierre de la modal
        }}
        isOpen={this.props.modalIsOpen} // Estado de apertura de la modal
      >
        {/* Renderiza el componente BlogForm dentro de la modal */}
        <BlogForm
          handleSuccessfullFormSubmission={this.handleSuccessfullFormSubmission}
        />
      </ReactModal>
    );
  }
}
