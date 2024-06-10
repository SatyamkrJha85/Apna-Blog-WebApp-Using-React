import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { register } from "../lib/api"; // Importing API function for user registration
import RegistrationForm from "../Components/Forms/RegistrationForm"; // Importing registration form component
import { useNavigate } from "react-router-dom"; // Importing hook for navigation
import Banner from "../Components/Banner"; // Importing banner component for displaying messages
import { useTranslation } from "react-i18next"; // Importing translation hook

const RegisterPage = (props) => {
  // State variables
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false); // State for tracking registration success
  const [registrationMessage, setRegistrationMessage] = useState(""); // State for storing registration message
  const navigate = useNavigate(); // Getting navigation function from React Router
  const { t } = useTranslation(); // Using translation hook for internationalization

  // Effect to navigate to login page after successful registration
  useEffect(() => {
    setTimeout(() => {
      if (isRegistrationSuccess) {
        setIsRegistrationSuccess(false); // Resetting registration success status
        navigate("/login"); // Navigating to login page
      }
    }, 2000); // Delaying navigation for 2 seconds
  }, [isRegistrationSuccess]); // Running effect when isRegistrationSuccess state changes

  // Function to handle form submission for user registration
  const onSubmit = (values, formikHelpers) => {
    setTimeout(() => {
      register(values)
        .then((data) => {
          formikHelpers.resetForm(); // Resetting form fields
          setRegistrationMessage( // Setting registration success message
            t("newUserCreated", { newUser: data.userName })
          );
          setIsRegistrationSuccess(true); // Setting registration success status to true
        })
        .catch((error) => {
          formikHelpers.setFieldError( // Setting form field error if registration fails
            "register",
            t("userAlreadyExists", { userName: error.message })
          );
        })
        .finally(() => {
          formikHelpers.setSubmitting(false); // Resetting form submission status
        });
    }, 1000); // Delaying form submission for 1 second
  };

  return (
    <Container className="" style={{marginTop:"170px" }}>
      <Row
        className="py-4 d-flex flex-column align-content-center"
        style={{
          marginTop: props.headerHeight, // Adjusting top margin based on header height
          marginBottom: props.footerHeight, // Adjusting bottom margin based on footer height
        }}
      >
        {/* Rendering the registration form component */}
        <RegistrationForm
          isSubmitted={isRegistrationSuccess}
          onSubmit={onSubmit}
        />
        {/* Displaying banner if registration is successful */}
        {isRegistrationSuccess && (
          <Banner
            className="text-success border-success mt-4"
            message={registrationMessage}
          />
        )}
      </Row>
    </Container>
  );
};

export default RegisterPage;
