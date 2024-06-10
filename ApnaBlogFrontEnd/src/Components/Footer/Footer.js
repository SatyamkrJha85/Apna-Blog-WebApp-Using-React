import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

class Footer extends React.Component {
  render() {
    return (
      <Container
        fluid
        className="bg-dark text-white py-4 rounded-10"
        style={{ borderTop: " solid #fff" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center">
              <a href="https://www.facebook.com"><FontAwesomeIcon icon={faFacebook} className="me-3 text-white" size="2x"/></a>
              <a href="https://www.twitter.com"><FontAwesomeIcon icon={faTwitter} className="me-3 text-white" size="2x"/></a>
              <a href="https://www.instagram.com"><FontAwesomeIcon icon={faInstagram} className="me-3 text-white" size="2x"/></a>
              <a href="https://www.linkedin.com"><FontAwesomeIcon icon={faLinkedin} className="me-3 text-white" size="2x"/></a>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
          <p className="mb-0">Privacy Policy | Terms of Service</p>
            <p className="mb-0">&copy; Apna Blog 2024</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Footer;
