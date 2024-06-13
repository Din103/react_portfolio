import React, { Component } from "react";
import axios from "axios"; // Importamos axios para manejar las solicitudes HTTP
import DropzoneComponent from "react-dropzone-component"; // Importamos Dropzone para la carga de archivos

import RichTextEditor from "../forms/rich-text-editor"; // Importamos el editor de texto enriquecido

export default class BlogForm extends Component {
  constructor(props) {
    super(props);
    // Estado inicial del componente
    this.state = {
      id: "",
      title: "",
      blog_status: "",
      content: "",
      featured_image: "",
      apiUrl: "https://jordan.devcamp.space/portfolio/portfolio_blogs",
      apiAction: "post"
    };

    // Enlazamos los métodos al contexto del componente
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRichTextEditorChange = this.handleRichTextEditorChange.bind(this);
    this.componentConfig = this.componentConfig.bind(this);// Referencia para Dropzone
    this.djsConfig = this.djsConfig.bind(this);// Referencia para Dropzone
    this.handleFeaturedImageDrop = this.handleFeaturedImageDrop.bind(this);// Referencia para Dropzone
    this.deleteImage = this.deleteImage.bind(this);// Referencia para Dropzone
    this.featuredImageRef = React.createRef(); // Referencia para Dropzone
  }
  // Método para eliminar la imagen
  deleteImage(imageType) {
    axios
      .delete(
        `https://api.devcamp.space/portfolio/delete-portfolio-blog-image/${this.props.blog.id}?image_type=${imageType}`,
        { withCredentials: true }
      )
      .then(response => {
        this.props.handleFeaturedImageDelete(); // Llamamos a la función de la prop para manejar la eliminación de la imagen
      })
      .catch(error => {
        console.log("deleteImage error", error);
      });
  }
  // Método del ciclo de vida antes de montar el componente
  componentWillMount() {
    if (this.props.editMode) {
      // Si estamos en modo edición, actualizamos el estado con los datos del blog
      this.setState({
        id: this.props.blog.id,
        title: this.props.blog.title,
        blog_status: this.props.blog.blog_status,
        content: this.props.blog.content,
        apiUrl: `https://jordan.devcamp.space/portfolio/portfolio_blogs/${this.props.blog.id}`,
        apiAction: "patch"
      });
    }
  }
  // Configuración del componente Dropzone
  componentConfig() {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post"
    };
  }
  // Configuración adicional para Dropzone
  djsConfig() {
    return {
      addRemoveLinks: true,
      maxFiles: 1
    };
  }
  // Maneja la carga de la imagen destacada
  handleFeaturedImageDrop() {
    return {
      addedfile: file => this.setState({ featured_image: file })
    };
  }
  // Maneja los cambios en el editor de texto enriquecido
  handleRichTextEditorChange(content) {
    this.setState({ content });
  }
  // Construye el formulario para enviar los datos
  buildForm() {
    let formData = new FormData();

    formData.append("portfolio_blog[title]", this.state.title);
    formData.append("portfolio_blog[blog_status]", this.state.blog_status);
    formData.append("portfolio_blog[content]", this.state.content);

    if (this.state.featured_image) {
      formData.append("portfolio_blog[featured_image]", this.state.featured_image);
    }
    return formData;
  }
  // Maneja el envío del formulario
  handleSubmit(event) {
    axios({
      method: this.state.apiAction,
      url: this.state.apiUrl,
      data: this.buildForm(),
      withCredentials: true
    })
      .then(response => {
        if (this.state.featured_image) {
          this.featuredImageRef.current.dropzone.removeAllFiles();
        }

        this.setState({
          title: "",
          blog_status: "",
          content: "",
          featured_image: ""
        });

        if (this.props.editMode) {
          this.props.handleUpdateFormSubmission(response.data.portfolio_blog);
        } else {
          this.props.handleSuccessfullFormSubmission(response.data.portfolio_blog);
        }
      })
      .catch(error => {
        console.log("handleSubmit for blog error", error);
      });

    event.preventDefault();
  }

  // Maneja los cambios en los campos del formulario
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  // Renderiza el formulario
  render() {
    return (
      // Formulario que maneja el envío con el método handleSubmit
      <form onSubmit={this.handleSubmit} className="blog-form-wrapper">        
        // División del formulario en dos columnas para el título y el estado del blog
        <div className="two-column">
          <input
            // Campo de entrada para el título del blog
            type="text"
            onChange={this.handleChange}
            name="title"
            placeholder="Blog Title"
            value={this.state.title} // Valor del estado para el título
          />
          <input
            // Campo de entrada para el estado del blog
            type="text"
            onChange={this.handleChange}
            name="blog_status"
            placeholder="Blog status"
            value={this.state.blog_status} // Valor del estado para el estado del blog
          />
        </div>  
        // División del formulario en una columna para el editor de texto enriquecido
        <div className="one-column">
          <RichTextEditor
            // Componente del editor de texto enriquecido
            handleRichTextEditorChange={this.handleRichTextEditorChange} // Método para manejar cambios en el contenido del editor
            editMode={this.props.editMode} // Propiedad para verificar si está en modo edición
            contentToEdit={
              // Contenido del editor si está en modo edición
              this.props.editMode && this.props.blog.content ? this.props.blog.content : null
            }
          />
        </div>  
        // División del formulario para la carga de imágenes
        <div className="image-uploaders">
          {this.props.editMode && this.props.blog.featured_image_url ? (
            // Muestra la imagen destacada si está en modo edición y existe una imagen destacada
            <div className="portfolio-manager-image-wrapper">
              <img src={this.props.blog.featured_image_url} />
              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("featured_image")}>
                  Remove file
                </a>
              </div>
            </div>
          ) : (
            // Componente Dropzone para subir una imagen si no hay imagen destacada
            <DropzoneComponent
              ref={this.featuredImageRef} // Referencia al componente Dropzone
              config={this.componentConfig()} // Configuración del componente Dropzone
              djsConfig={this.djsConfig()} // Configuración de Dropzone.js
              eventHandlers={this.handleFeaturedImageDrop()} // Maneja el evento de cargar una imagen
            >
              <div className="dz-message">Featured Image</div>
            </DropzoneComponent>
          )}
        </div>  
        // Botón para guardar el formulario
        <button className="btn">Save</button>
      </form>
    );
  }
  
}
