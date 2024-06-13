import React, { Component } from "react"; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; 
import axios from "axios"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import NavigationContainer from "./navigation/navigation-container"; 
import Home from "./pages/home"; 
import About from "./pages/about"; 
import Contact from "./pages/contact"; 
import Blog from "./pages/blog"; 
import BlogDetail from "./pages/blog-detail"; 
import PortfolioManager from "./pages/portfolio-manager"; 
import PortfolioDetail from "./portfolio/portfolio-detail"; 
import Auth from "./pages/auth"; 
import NoMatch from "./pages/no-match"; 
import Icons from "../helpers/icons";

// Componente App principal de la aplicación
export default class App extends Component {
  constructor(props) {
    super(props);
    Icons(); // Inicialización de los íconos de FontAwesome
    this.state = {
      loggedInStatus: "NOT_LOGGED_IN" // Estado inicial de loggedInStatus
    };
    // Enlazar métodos al contexto del componente
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
  }
  // Método para manejar inicio de sesión exitoso
  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN"
    });
  }
  // Método para manejar inicio de sesión fallido
  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    });
  }
  // Método para manejar cierre de sesión exitoso
  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    });
  }
  // Método para verificar el estado de inicio de sesión
  checkLoginStatus() {
    return axios
      .get("https://api.devcamp.space/logged_in", {
        withCredentials: true
      })
      .then(response => {
        const loggedIn = response.data.logged_in;
        const loggedInStatus = this.state.loggedInStatus;
        // Verifica y actualiza el estado de loggedInStatus según la respuesta de la API
        if (loggedIn && loggedInStatus === "LOGGED_IN") {
          return loggedIn;
        } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN") {
          this.setState({
            loggedInStatus: "LOGGED_IN"
          });
        } else if (!loggedIn && loggedInStatus === "LOGGED_IN") {
          this.setState({
            loggedInStatus: "NOT_LOGGED_IN"
          });
        }
      })
      .catch(error => {
        console.log("Error", error);
      });
  }
  // Ejecuta checkLoginStatus cuando el componente se monta
  componentDidMount() {
    this.checkLoginStatus();
  }

  // Método para renderizar rutas autorizadas
  authorizedPages() {
    return [
      <Route
        key="portfolio-manager"
        path="/portfolio-manager"
        component={PortfolioManager}
      />
    ];
  }
  render() {
    return (
      <div className="container">
        <Router>
          <div>
            {/* Navegación principal */}
            <NavigationContainer
              loggedInStatus={this.state.loggedInStatus}
              handleSuccessfulLogout={this.handleSuccessfulLogout}
            />
            {/* Definición de las rutas */}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                path="/auth"
                render={props => (
                  <Auth
                    {...props}
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                )}
              />
              <Route path="/about-me" component={About} />
              <Route path="/contact" component={Contact} />
              <Route
                path="/blog"
                render={props => (
                  <Blog {...props} loggedInStatus={this.state.loggedInStatus} />
                )}
              />
              <Route
                path="/b/:slug"
                render={props => (
                  <BlogDetail
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                )}
              />
              {this.state.loggedInStatus === "LOGGED_IN"
                ? this.authorizedPages()
                : null}
              <Route
                exact
                path="/portfolio/:slug"
                component={PortfolioDetail}
              />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
