//portfolio-form
//apiUrl: "https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items",
//apiUrl: `https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items/${id}`,

import React, { Component } from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";
import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

export default class PortfolioForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      category: "eCommerce", //damos un valor por omisión
      position: "",
      url: "",
      thumb_image: "",
      banner_image: "",
      logo: "",
      editMode: false,//valor que indica que es un registro nuevo
      // apiUrl: "https://jordan.devcamp.space/portfolio/portfolio_items",
      apiUrl: "https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items",
      apiAction: "post"//Aquí pasamos la acción para que se añada un registro nuevo
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentConfig = this.componentConfig.bind(this);
    this.djsConfig = this.djsConfig.bind(this);
    this.handleThumbDrop = this.handleThumbDrop.bind(this);
    this.handleBannerDrop = this.handleBannerDrop.bind(this);
    this.handleLogoDrop = this.handleLogoDrop.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.thumbRef = React.createRef(); //creamos las referencias de React
    this.bannerRef = React.createRef();
    this.logoRef = React.createRef();
  }
  deleteImage(imageType) {
    //aquí eliminamos la imagen concreta de un registro concreto
    axios
      .delete(
        `https://api.devcamp.space/portfolio/delete-portfolio-image/${this.state
          .id}?image_type=${imageType}`,
        { withCredentials: true }
      )
      .then(response => {
        this.setState({
          [`${imageType}_url`]: ""
        });
      })
      .catch(error => {
        console.log("deleteImage error", error);
      });
  }
  componentDidUpdate() {
    if (Object.keys(this.props.portfolioToEdit).length > 0) {//comprobamos que el objeto tenga contenido
      const {
        id,
        name,
        description,
        category,
        position,
        url,
        thumb_image_url,//añadimos _url a los nombres para diferenciar edición/registro nuevo
        banner_image_url,
        logo_url
      } = this.props.portfolioToEdit;//hacemos una deconstrucción del props

      this.props.clearPortfolioToEdit(); //ahora limpiamos el state del portfolio manager para que no se repita la función anterior

      this.setState({ //poblamos el formulario
        id: id, //todo registro tiene id
        name: name || "", //el opcional es para los casos que el valor venga vacio y evitar pasar NULL
        description: description || "",
        category: category || "eCommerce",
        position: position || "",
        url: url || "",
        editMode: true, //Aqui modificamos el editMode a True para que se edite y no cree un registro nuevo
        // apiUrl: `https://jordan.devcamp.space/portfolio/portfolio_items/${id}`,
        apiUrl: `https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items/${id}`,//Añadimos id para que se edite
        apiAction: "patch",//Aquí pasamos la acción para que se edite
        thumb_image_url: thumb_image_url || "",
        banner_image_url: banner_image_url || "",
        logo_url: logo_url || ""
      });
    }
  }
  handleThumbDrop() {
    return { //a continuación viene una codificación propia de dropzone
      addedfile: file => this.setState({ thumb_image: file })
    };
  }
  handleBannerDrop() {
    return {
      addedfile: file => this.setState({ banner_image: file })
    };
  }
  handleLogoDrop() {
    return {
      addedfile: file => this.setState({ logo: file })
    };
  }
  //a continuación se configura el tipo de ficheros que se puede importar.
  componentConfig() {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      //Aquí damos una dirección de pega que devuelve true. Permite seguir trabajando en el formulario.
      postUrl: "https://httpbin.org/post"
    };
  }
  djsConfig() {
    return {
      addRemoveLinks: true,
      maxFiles: 1
    };
  }
  buildForm() {
    let formData = new FormData();
    formData.append("portfolio_item[name]", this.state.name);
    formData.append("portfolio_item[description]", this.state.description);
    formData.append("portfolio_item[url]", this.state.url);
    formData.append("portfolio_item[category]", this.state.category);
    formData.append("portfolio_item[position]", this.state.position);

    if (this.state.thumb_image) { //hay que condicionar a si se ha incluído imagen
      formData.append("portfolio_item[thumb_image]", this.state.thumb_image);
    }
    if (this.state.banner_image) {
      formData.append("portfolio_item[banner_image]", this.state.banner_image);
    }
    if (this.state.logo) {
      formData.append("portfolio_item[logo]", this.state.logo);
    }
    return formData;
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleSubmit(event) {
    axios({
      method: this.state.apiAction,//con apiAction le pasamos si es catch o push
      url: this.state.apiUrl,
      data: this.buildForm(),
      withCredentials: true
    })
      .then(response => {
        if (this.state.editMode) {
          this.props.handleEditFormSubmission();
        } else {
          this.props.handleNewFormSubmission(response.data.portfolio_item);
        }
        this.setState({
          name: "",
          description: "",
          category: "eCommerce",
          position: "",
          url: "",
          thumb_image: "",
          banner_image: "",
          logo: "",
          editMode: false,
          apiUrl: "https://jordan.devcamp.space/portfolio/portfolio_items",
          apiAction: "post"
        });
        // A continuación utilizamos las referencias de REACT con una función sacada de dropzone para limpiar los dropzone
        //(con poner en el state "" no es suficiente pues quedan las imagenes en el DOM)
        [this.thumbRef, this.bannerRef, this.logoRef].forEach(ref => {
          ref.current.dropzone.removeAllFiles();
        });
      })
      .catch(error => {
        console.log("portfolio form handleSubmit error", error);
      });
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="portfolio-form-wrapper">
        <div className="two-column">
          <input
            type="text"
            name="name"
            placeholder="Portfolio Item Name"
            value={this.state.name}
            onChange={this.handleChange}
          />

          <input
            type="text"
            name="url"
            placeholder="URL"
            value={this.state.url}
            onChange={this.handleChange}
          />
        </div>

        <div className="two-column">
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={this.state.position}
            onChange={this.handleChange}
          />
            <select // Aqui generamos el selector de opciones
            name="category"
            value={this.state.category}
            onChange={this.handleChange}
            className="select-element"
          >
            <option value="eCommerce">eCommerce</option>
            <option value="Scheduling">Scheduling</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div className="one-column">
          <textarea //Aquí va el textarea
            type="text"
            name="description"
            placeholder="Description"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>
        <div className="image-uploaders">
          {/* Empezamos un largo ternary operator para ver que hacemos con cada imagen */}
          {this.state.thumb_image_url && this.state.editMode ? 
          (<div className="portfolio-manager-image-wrapper">
              <img src={this.state.thumb_image_url} />
              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("thumb_image")}>
                  Remove file
                </a>
              </div>
          </div>) 
          : 
          (<DropzoneComponent
              ref={this.thumbRef}//enlazamos con la referencia de React
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleThumbDrop()}
            >
              {/* A continuación editamos la etiqueta del dropzone como un "childcomponent" */}
              <div className="dz-message">Thumbnail</div>
            </DropzoneComponent>
          )}
          {this.state.banner_image_url && this.state.editMode ? (
            <div className="portfolio-manager-image-wrapper">
              <img src={this.state.banner_image_url} />
              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("banner_image")}>
                  Remove file
                </a>
              </div>
            </div>)
             : 
             (<DropzoneComponent
              ref={this.bannerRef}//enlazamos con la referencia de React
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleBannerDrop()}
            >
              {/* A continuación editamos la etiqueta del dropzone como un "childcomponent" */}
              <div className="dz-message">Banner</div>
            </DropzoneComponent>
          )}
          {this.state.logo_url && this.state.editMode ? (
            <div className="portfolio-manager-image-wrapper">
              <img src={this.state.logo_url} />
              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("logo")}>Remove file</a>
              </div>
            </div>) 
            : 
            (<DropzoneComponent
              ref={this.logoRef}//enlazamos con la referencia de React
              config={this.componentConfig()}
              djsConfig={this.djsConfig()}
              eventHandlers={this.handleLogoDrop()}
            >
              {/* A continuación editamos la etiqueta del dropzone como un "childcomponent" */}
              <div className="dz-message">Logo</div>
            </DropzoneComponent>
          )}
        </div>
        <div>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    );
  }
}
