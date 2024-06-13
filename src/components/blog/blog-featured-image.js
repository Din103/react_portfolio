import React from "react";

// Definición del componente BlogFeaturedImage como una función de componente
const BlogFeaturedImage = (props) => {
  // Verifica si no hay una imagen proporcionada en las props
  if (!props.img) {
    return null; // Si no hay imagen, no se renderiza nada (retorna null)
  }
  // Renderiza la imagen si se proporciona
  return (
    <div className="featured-image-wrapper">
      <img src={props.img} alt="Featured" /> {/* Muestra la imagen proporcionada */}
    </div>
  );
};

export default BlogFeaturedImage; // Exporta el componente para su uso en otros archivos
