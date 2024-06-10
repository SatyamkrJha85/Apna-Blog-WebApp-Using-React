import React, { useContext, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { login } from "../lib/api"; // Importing the login function from an API module
import LoginForm from "../Components/Forms/LoginForm"; // Importing LoginForm component
import AuthContext from "../store/auth-context"; // Importing AuthContext for authentication
import Banner from "../Components/Banner"; // Importing Banner component
import { useTranslation } from "react-i18next"; // Importing useTranslation for internationalization

const LoginPage = (props) => {
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); // State to track login success
  const [loginMessage, setLoginMessage] = useState(""); // State to store login message
  const authCtx = useContext(AuthContext); // Accessing authentication context
  const { t } = useTranslation(); // Initializing translation hook

  // Function to handle form submission
  const onSubmit = (loginRequest, formikHelpers) => {
    setTimeout(() => { // Simulating asynchronous operation
      login(loginRequest) // Calling login API function
        .then((loginResponse) => { // Handling successful login response
          setIsLoginSuccess(true); // Setting login success state to true
          setLoginMessage(`${t("signedInAs")} ${loginResponse.userName}`); // Setting login message
          setTimeout(() => { // Delaying authentication context update
            authCtx.login(loginResponse); // Authenticating user
          }, 2000);
        })
        .catch((error) => { // Handling login error
          if (error.message.includes("password")) { // Checking if error is related to password
            formikHelpers.setFieldError(
              "invalidPassword",
              t("validation:invalidPassword")
            ); // Setting form field error for password
          } else {
            formikHelpers.setFieldError(
              "invalidUsername",
              t("validation:invalidUsername")
            ); // Setting form field error for username
          }
        })
        .finally(() => { // Resetting form submission state
          formikHelpers.setSubmitting(false);
        });
    }, 1000); // Simulated delay before API call
  };

  return (
    <Container className="" style={{ marginTop: "170px" }}>
      <Row
        className="py-4 d-flex flex-column align-content-center"
        style={{
          marginTop: props.headerHeight,
          marginBottom: props.footerHeight,
        }}
      >
        <LoginForm isSubmitted={isLoginSuccess} onSubmit={onSubmit} /> {/* Rendering login form */}
        {isLoginSuccess && ( // Rendering banner if login is successful
          <Banner
            className="text-success border-success mt-4"
            message={loginMessage}
          />
        )}
      </Row>
    </Container>
  );
};

export default LoginPage;
