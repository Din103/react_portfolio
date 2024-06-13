import React from "react";
import { Link } from "react-router-dom"; // Importar el componente Link de react-router-dom para la navegación
import striptags from "striptags"; // Importar la librería striptags para eliminar las etiquetas HTML del contenido
import Truncate from "react-truncate"; // Importar el componente Truncate para truncar el contenido del blog

const BlogItem = (props) => {
  // Desestructurar las propiedades del objeto blogItem pasado como prop
  const { id, blog_status, content, title, featured_image_url } = props.blogItem;

  return (
    <div>
      {/* Enlace al detalle del blog utilizando el id del blog */}
      <Link to={`/b/${id}`}>
        <h1>{title}</h1> {/* Título del blog */}
      </Link>
      <div>
        {/* Truncar el contenido del blog a 5 líneas */}
        <Truncate
          lines={5}
          ellipsis={
            <span>
              ...<Link to={`/b/${id}`}>Read more</Link> {/* Enlace para leer más */}
            </span>
          }
        >
          {striptags(content)} {/* Eliminar etiquetas HTML del contenido */}
        </Truncate>
      </div>
    </div>
  );
};

export default BlogItem; // Exportar el componente para su uso en otros lugares de la aplicación
