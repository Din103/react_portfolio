//Este componente de clase ha sido modificado a componente funcional por chatgpt

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";
import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

const PortfolioForm = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("eCommerce"); // Valor por omisión
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [thumbImage, setThumbImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [logo, setLogo] = useState("");
  const [editMode, setEditMode] = useState(false); // Indica que es un registro nuevo
  const [apiUrl, setApiUrl] = useState("https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items");
  const [apiAction, setApiAction] = useState("post"); // Acción para añadir un registro nuevo

  const thumbRef = useRef(); // Referencias de React
  const bannerRef = useRef();
  const logoRef = useRef();

  const deleteImage = (imageType) => {
    // Elimina la imagen concreta de un registro concreto
    axios
      .delete(
        `https://api.devcamp.space/portfolio/delete-portfolio-image/${props.portfolioToEdit.id}?image_type=${imageType}`,
        { withCredentials: true }
      )
      .then((response) => {
        if (imageType === "thumb_image") setThumbImage("");
        else if (imageType === "banner_image") setBannerImage("");
        else if (imageType === "logo") setLogo("");
      })
      .catch((error) => {
        console.log("deleteImage error", error);
      });
  };

  useEffect(() => {
    if (Object.keys(props.portfolioToEdit).length > 0) {
      // Comprueba que el objeto tenga contenido
      const {
        id,
        name,
        description,
        category,
        position,
        url,
        thumb_image_url,
        banner_image_url,
        logo_url,
      } = props.portfolioToEdit; // Deconstrucción del props

      props.clearPortfolioToEdit(); // Limpia el state del portfolio manager para que no se repita la función anterior

      setName(name || "");
      setDescription(description || "");
      setCategory(category || "eCommerce");
      setPosition(position || "");
      setUrl(url || "");
      setEditMode(true); // Edita en lugar de crear un registro nuevo
      setApiUrl(`https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items/${id}`);
      setApiAction("patch"); // Acción para editar
      setThumbImage(thumb_image_url || "");
      setBannerImage(banner_image_url || "");
      setLogo(logo_url || "");
    }
  }, [props.portfolioToEdit]);

  const handleThumbDrop = () => ({
    addedfile: (file) => setThumbImage(file),
  });

  const handleBannerDrop = () => ({
    addedfile: (file) => setBannerImage(file),
  });

  const handleLogoDrop = () => ({
    addedfile: (file) => setLogo(file),
  });

  // Configura el tipo de ficheros que se puede importar
  const componentConfig = () => ({
    iconFiletypes: [".jpg", ".png"],
    showFiletypeIcon: true,
    // Dirección de pega que devuelve true para seguir trabajando en el formulario
    postUrl: "https://httpbin.org/post",
  });

  const djsConfig = () => ({
    addRemoveLinks: true,
    maxFiles: 1,
  });

  const buildForm = () => {
    let formData = new FormData();
    formData.append("portfolio_item[name]", name);
    formData.append("portfolio_item[description]", description);
    formData.append("portfolio_item[url]", url);
    formData.append("portfolio_item[category]", category);
    formData.append("portfolio_item[position]", position);

    if (thumbImage) {
      formData.append("portfolio_item[thumb_image]", thumbImage);
    }
    if (bannerImage) {
      formData.append("portfolio_item[banner_image]", bannerImage);
    }
    if (logo) {
      formData.append("portfolio_item[logo]", logo);
    }
    return formData;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "position":
        setPosition(value);
        break;
      case "url":
        setUrl(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    axios({
      method: apiAction, // Acción de la API (patch o post)
      url: apiUrl,
      data: buildForm(),
      withCredentials: true,
    })
      .then((response) => {
        if (editMode) {
          props.handleEditFormSubmission();
        } else {
          props.handleNewFormSubmission(response.data.portfolio_item);
        }
        setName("");
        setDescription("");
        setCategory("eCommerce");
        setPosition("");
        setUrl("");
        setThumbImage("");
        setBannerImage("");
        setLogo("");
        setEditMode(false);
        setApiUrl("https://xabierbeorlegui.devcamp.space/portfolio/portfolio_items");
        setApiAction("post");
        // Limpia los dropzones utilizando referencias de React
        [thumbRef, bannerRef, logoRef].forEach((ref) => {
          ref.current.dropzone.removeAllFiles();
        });
      })
      .catch((error) => {
        console.log("portfolio form handleSubmit error", error);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="portfolio-form-wrapper">
      <div className="two-column">
        <input
          type="text"
          name="name"
          placeholder="Portfolio Item Name"
          value={name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="url"
          placeholder="URL"
          value={url}
          onChange={handleChange}
        />
      </div>

      <div className="two-column">
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={position}
          onChange={handleChange}
        />
        <select
          name="category"
          value={category}
          onChange={handleChange}
          className="select-element"
        >
          <option value="eCommerce">eCommerce</option>
          <option value="Scheduling">Scheduling</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      <div className="one-column">
        <textarea
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleChange}
        />
      </div>

      <div className="image-uploaders">
        {/* Ternary operator para manejar cada imagen */}
        {thumbImage && editMode ? (
          <div className="portfolio-manager-image-wrapper">
            <img src={thumbImage} alt="Thumbnail" />
            <div className="image-removal-link">
              <a onClick={() => deleteImage("thumb_image")}>Remove file</a>
            </div>
          </div>
        ) : (
          <DropzoneComponent
            ref={thumbRef}
            config={componentConfig()}
            djsConfig={djsConfig()}
            eventHandlers={handleThumbDrop()}
          >
            <div className="dz-message">Thumbnail</div>
          </DropzoneComponent>
        )}

        {bannerImage && editMode ? (
          <div className="portfolio-manager-image-wrapper">
            <img src={bannerImage} alt="Banner" />
            <div className="image-removal-link">
              <a onClick={() => deleteImage("banner_image")}>Remove file</a>
            </div>
          </div>
        ) : (
          <DropzoneComponent
            ref={bannerRef}
            config={componentConfig()}
            djsConfig={djsConfig()}
            eventHandlers={handleBannerDrop()}
          >
            <div className="dz-message">Banner</div>
          </DropzoneComponent>
        )}

        {logo && editMode ? (
          <div className="portfolio-manager-image-wrapper">
            <img src={logo} alt="Logo" />
            <div className="image-removal-link">
              <a onClick={() => deleteImage("logo")}>Remove file</a>
            </div>
          </div>
        ) : (
          <DropzoneComponent
            ref={logoRef}
            config={componentConfig()}
            djsConfig={djsConfig()}
            eventHandlers={handleLogoDrop()}
          >
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
};

export default PortfolioForm;
