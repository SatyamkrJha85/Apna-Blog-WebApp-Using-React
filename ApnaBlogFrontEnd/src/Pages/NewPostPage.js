import React, { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import NewPostForm from "../Components/Forms/NewPostForm"; // Importing a form component for creating a new post
import { submitNewPost } from "../lib/api"; // Importing a function for submitting a new post
import AuthContext from "../store/auth-context"; // Importing authentication context
import Banner from "../Components/Banner"; // Importing a banner component for displaying messages
import { useNavigate } from "react-router-dom"; // Importing a hook for navigation
import { useTranslation } from "react-i18next"; // Importing a hook for translation

const NewPostPage = (props) => {
  // State variables
  const [isSubmitted, setIsSubmitted] = useState(false); // State for tracking if the form is submitted
  const [newPostId, setNewPostId] = useState(null); // State for storing the ID of the newly created post

  // Context and hooks
  const authContext = useContext(AuthContext); // Accessing authentication context
  const navigate = useNavigate(); // Getting the navigation function from React Router
  const { t } = useTranslation(); // Using translation hook for internationalization

  // Function to handle form submission
  const onSubmit = (newPost, formikHelpers) => {
    submitNewPost(newPost, authContext.token) // Calling the API function to submit new post
      .then((post) => {
        setTimeout(() => {
          setNewPostId(post.id); // Setting the ID of the newly created post
          setIsSubmitted(true); // Setting form submission status to true
        }, 2000);
      })
      .catch((error) => {
        console.log(error); // Logging any errors that occur during submission
      })
      .finally(() => {
        setTimeout(() => {
          formikHelpers.setSubmitting(false); // Resetting form submission status after submission attempt
        }, 2000);
      });
  };

  // Effect to navigate to the newly created post after submission
  useEffect(() => {
    setTimeout(() => {
      if (isSubmitted) {
        setIsSubmitted(false); // Resetting form submission status
        navigate(`/post/${newPostId}`); // Navigating to the newly created post
      }
    }, 2000); // Delaying navigation for 2 seconds
  }, [isSubmitted]); // Running effect when isSubmitted state changes

  return (
    <Container>
      <Row
        className="py-4 d-flex flex-column justify-content-center"
        style={{
          marginTop: props.headerHeight, // Using props to adjust top margin based on header height
          marginBottom: props.footerHeight, // Using props to adjust bottom margin based on footer height
        }}
      >
        {/* Rendering the new post form component */}
        <NewPostForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
        {/* Rendering a banner if form is submitted successfully */}
        {isSubmitted && (
          <Banner
            className="text-success border-success mt-4"
            message={`${t("addedBy", { type: "post" })} ${
              authContext.userName
            }`}
          />
        )}
      </Row>
    </Container>
  );
};

export default NewPostPage;
