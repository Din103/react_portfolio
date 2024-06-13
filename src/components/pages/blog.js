import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import BlogItem from "../blog/blog-item";
import BlogModal from "../modals/blog-modal";

// Componente de clase Blog que maneja el blog de la aplicación
class Blog extends Component {
  constructor() {
    super();
    // Estado inicial del componente
    this.state = {
      blogItems: [],
      totalCount: 0,
      currentPage: 0,
      isLoading: true,
      blogModalIsOpen: false
    };
    // Enlazar métodos al contexto del componente
    this.getBlogItems = this.getBlogItems.bind(this);
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll, false);
    this.handleNewBlogClick = this.handleNewBlogClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSuccessfulNewBlogSubmission = this.handleSuccessfulNewBlogSubmission.bind(
      this
    );
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  // Maneja la eliminación de un blog
  handleDeleteClick(blog) {
    axios
      .delete(
        `https://api.devcamp.space/portfolio/portfolio_blogs/${blog.id}`,
        { withCredentials: true }
      )
      .then(response => {
        // Filtra el blog eliminado del estado
        this.setState({
          blogItems: this.state.blogItems.filter(blogItem => {
            return blog.id !== blogItem.id;
          })
        });
        return response.data;
      })
      .catch(error => {
        console.log("delete blog error", error);
      });
  }
  // Maneja la adición exitosa de un nuevo blog
  handleSuccessfulNewBlogSubmission(blog) {
    this.setState({
      blogModalIsOpen: false,
      blogItems: [blog].concat(this.state.blogItems)
    });
  }
  // Maneja el cierre del modal
  handleModalClose() {
    this.setState({
      blogModalIsOpen: false
    });
  }
  // Maneja la apertura del modal para un nuevo blog
  handleNewBlogClick() {
    this.setState({
      blogModalIsOpen: true
    });
  }
  // Maneja el evento de scroll para carga infinita
  onScroll() {
    if (
      this.state.isLoading ||
      this.state.blogItems.length === this.state.totalCount
    ) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      this.getBlogItems();
    }
  }
  // Obtiene los ítems del blog de la API
  getBlogItems() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
    axios
      .get(
        `https://jordan.devcamp.space/portfolio/portfolio_blogs?page=${
          this.state.currentPage
        }`,
        {
          withCredentials: true
        }
      )
      .then(response => {
        console.log("gettting", response.data);
        this.setState({
          blogItems: this.state.blogItems.concat(response.data.portfolio_blogs),
          totalCount: response.data.meta.total_records,
          isLoading: false
        });
      })
      .catch(error => {
        console.log("getBlogItems error", error);
      });
  }
  // Ejecuta la obtención de blogs cuando el componente se monta
  componentWillMount() {
    this.getBlogItems();
  }
  // Elimina el listener de scroll cuando el componente se desmonta
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }
  render() {
    // Mapea los items del blog a componentes BlogItem
    const blogRecords = this.state.blogItems.map(blogItem => {
      if (this.props.loggedInStatus === "LOGGED_IN") {
        return (
          <div key={blogItem.id} className="admin-blog-wrapper">
            <BlogItem blogItem={blogItem} />
            <a onClick={() => this.handleDeleteClick(blogItem)}>
              <FontAwesomeIcon icon="trash" />
            </a>
          </div>
        );
      } else {
        return <BlogItem key={blogItem.id} blogItem={blogItem} />;
      }
    });

    return (
      <div className="blog-container">
        <BlogModal
          handleSuccessfulNewBlogSubmission={
            this.handleSuccessfulNewBlogSubmission
          }
          handleModalClose={this.handleModalClose}
          modalIsOpen={this.state.blogModalIsOpen}
        />
        {/* Renderiza el enlace para agregar un nuevo blog si el usuario está logueado */}
        {this.props.loggedInStatus === "LOGGED_IN" ? (
          <div className="new-blog-link">
            <a onClick={this.handleNewBlogClick}>
              <FontAwesomeIcon icon="plus-circle" />
            </a>
          </div>
        ) : null}
        {/* Renderiza los registros del blog */}
        <div className="content-container">{blogRecords}</div>
        {/* Muestra un loader mientras se cargan los blogs */}
        {this.state.isLoading ? (
          <div className="content-loader">
            <FontAwesomeIcon icon="spinner" spin />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Blog;
