import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { withTranslation } from "react-i18next";
import Title from "../Title";

class Header extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
    };
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  resizeHandler() {
    const height = this.header.clientHeight;
    this.setState({ height });
    this.props.onHeightChange(height);
  }

  componentDidMount() {
    this.resizeHandler();
    window.addEventListener("resize", this.resizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  logoutHandler = () => {
    // console.log("logging out from header");
    this.context.logout();
  };

  render() {
    let { isLoggedIn, userName } = this.context;
    const { t, i18n } = this.props;

    return (
      <Container
        fluid
        className="fixed-top border-bottom text-center  boxShadow" style={{
          backgroundColor:"#D5F5E3",
        }}
        ref={(header) => {
          this.header = header;
        }}
      >
        <Navbar  expand="sm" style={{
          backgroundColor:"#D5F5E3",
        }}>
          <Container fluid>
            <Navbar.Brand to="/" as={NavLink}>
              <Title /> {/* Translate the content of the Title component */}
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {isLoggedIn && (
                <Nav className="d-flex w-100 justify-content-end">
                  <Link
                    className="me-auto button btn btn-outline-success ms-1 my-2 text-decoration-none"
                    to="/new-post"
                    as={NavLink}
                  >
                    {t("newPost")}
                  </Link>
                  <div
                    className="btn align-self-center text-secondary"
                    style={{ cursor: "default" }}
                  >
                    <span style={{ fontWeight: "bold", color: "green" ,fontSize:"18px"}}>{`${t(
                      "signedInAs"
                    )}: ${userName}`}</span>

                  </div>
                  <Link
                    className="button btn btn-success me-1 my-2 text-decoration-none"
                    to="/"
                    as={NavLink}
                    onClick={this.logoutHandler}
                  >
                    {t("logout")}
                  </Link>
                </Nav>
              )}

              {!isLoggedIn && (
                <Nav className="d-flex w-100 justify-content-end">
                  <Link
                    className="button btn btn-success me-1 my-1 text-decoration-none m-2"
                    to="/login"
                    as={NavLink}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    className="button btn btn-success me-1 my-1 text-decoration-none m-2"
                    to="/register"
                    as={NavLink}
                  >
                    {t("register")}
                  </Link>
                </Nav>
              )}

              {/* Standalone button for About Us */}
              <Link
                className="button btn btn-success btn-md me-1 my-1 text-decoration-none m-2"
                to="/about-us"
                as={NavLink}
              >
                {t("AboutUs")}
              </Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    );
  }
}

export default withTranslation()(Header);
