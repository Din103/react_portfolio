import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg"; // Importa el editor de texto enriquecido
import draftToHtml from "draftjs-to-html"; // Convierte el contenido de DraftJS a HTML
import htmlToDraft from "html-to-draftjs"; // Convierte HTML a contenido de DraftJS

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props); // Llama al constructor de la clase base (Component)
    this.state = {
      editorState: EditorState.createEmpty() // Estado inicial del editor como vacío
    };
    // Enlaza los métodos al contexto del componente
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  // Método del ciclo de vida que se ejecuta antes de que el componente se monte
  componentWillMount() {
    // Si está en modo de edición y hay contenido para editar
    if (this.props.editMode && this.props.contentToEdit) {
      // Convierte el HTML a bloques de DraftJS
      const blocksFromHtml = htmlToDraft(this.props.contentToEdit);
      const { contentBlocks, entityMap } = blocksFromHtml;
      // Crea un estado de contenido a partir de los bloques
      const contentState = ContentState.createFromBlockArray(contentBlocks,entityMap);
      // Crea un estado del editor con el contenido
      const editorState = EditorState.createWithContent(contentState);
      // Establece el estado del editor
      this.setState({ editorState });
    }
  }
  // Maneja los cambios en el estado del editor
  onEditorStateChange(editorState) {
    // Actualiza el estado del editor
    this.setState(
      { editorState },
      // Llama a la función de prop para manejar el cambio en el editor de texto enriquecido
      this.props.handleRichTextEditorChange(
        // Convierte el contenido del editor de DraftJS a HTML y lo pasa a la función de prop
        draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
      )
    );
  }
  // Convierte un archivo a una cadena base64
  getBase64(file, callback) {
    let reader = new FileReader(); // Crea una nueva instancia de FileReader
    reader.readAsDataURL(file); // Lee el archivo como una URL de datos
    reader.onload = () => callback(reader.result); // Llama al callback con el resultado una vez que se carga el archivo
    reader.onerror = error => {}; // Maneja errores en la lectura del archivo
  }

  // Sube un archivo y lo convierte a base64
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      // Convierte el archivo a base64 y resuelve la promesa con el enlace de datos
      this.getBase64(file, data => resolve({ data: { link: data } }));
    });
  }

  // Renderiza el componente
  render() {
    return (
      <div>
        <Editor
          // Estado del editor
          editorState={this.state.editorState}
          // Clases CSS para el contenedor y el editor
          wrapperClassName="demo-wrapper"
          editorClassname="demo-editor"
          // Maneja el cambio en el estado del editor
          onEditorStateChange={this.onEditorStateChange}
          // Configuración de la barra de herramientas del editor
          toolbar={{
            inline: { inDropdown: true }, // Opciones de texto en línea en un menú desplegable
            list: { inDropdown: true }, // Opciones de lista en un menú desplegable
            textAlign: { inDropdown: true }, // Opciones de alineación de texto en un menú desplegable
            link: { inDropdown: true }, // Opciones de enlace en un menú desplegable
            history: { inDropdown: true }, // Opciones de historial en un menú desplegable
            image: {
              uploadCallback: this.uploadFile, // Callback para cargar imágenes
              alt: { present: true, mandatory: false }, // Opciones de texto alternativo para imágenes
              previewImage: true, // Mostrar vista previa de imágenes
              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg" // Tipos de archivos de imagen aceptados
            }
          }}
        />
      </div>
    );
  }
}
