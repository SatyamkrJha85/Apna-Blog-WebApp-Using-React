import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import NewCommentForm from "../Components/Forms/NewCommentForm"; // Importing form for adding new comments
import CommentsList from "../Components/CommentsList"; // Importing component for displaying comments
import PostUpdateForm from "../Components/Forms/PostUpdateForm"; // Importing form for updating posts
import Loading from "../Components/Loading"; // Importing loading spinner component
import { deletePost, getPostById, updatePost } from "../lib/api"; // Importing API functions for interacting with posts
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and getting URL parameters
import Banner from "../Components/Banner"; // Importing banner component for displaying messages
import AuthContext from "../store/auth-context"; // Importing authentication context
import { useTranslation } from "react-i18next"; // Importing translation hook

const PostPage = (props) => {
  // State variables
  const [post, setPost] = useState({}); // State for storing post data
  const [comments, setComments] = useState([]); // State for storing comments associated with the post
  const [isLoading, setIsLoading] = useState(true); // State for tracking loading status
  const [isPostUpdated, setIsPostUpdated] = useState(false); // State for tracking post update status
  const [isPostDeleted, setIsPostDeleted] = useState(false); // State for tracking post deletion status
  const [isDeletingPost, setIsDeletingPost] = useState(false); // State for tracking post deletion process
  const [error, setError] = useState(null); // State for storing error message
  const { id } = useParams(); // Getting post ID from URL parameters
  const authCtx = useContext(AuthContext); // Accessing authentication context
  const navigate = useNavigate(); // Getting navigation function from React Router
  const { t } = useTranslation(); // Using translation hook for internationalization

  // Function to handle post update
  const onPostUpdate = (updatedContent, formikHelpers) => {
    setTimeout(() => {
      updatePost(
        { id: post.id, content: updatedContent.content },
        authCtx.token
      )
        .then(() => {
          setIsPostUpdated(true); // Setting post update status to true
        })
        .catch((error) => {
          console.log(error); // Logging any errors that occur during post update
        })
        .finally(() => {
          formikHelpers.setSubmitting(false); // Resetting form submission status
        });
    }, 1000);
  };

  // Function to handle post deletion
  const onPostDelete = () => {
    setIsDeletingPost(true); // Setting post deletion status to true
    setTimeout(() => {
      deletePost(post.id, authCtx.token)
        .then(() => {
          setIsPostDeleted(true); // Setting post deletion status to true
        })
        .catch((error) => {
          console.log(error); // Logging any errors that occur during post deletion
        })
        .finally(() => {
          setIsDeletingPost(false); // Resetting post deletion status
        });
    }, 1000);
  };

  // Function to fetch post data by ID
  const fetchPostById = () => {
    setIsLoading(true); // Setting loading status to true
    getPostById(id)
      .then((post) => {
        setPost(post); // Setting fetched post data
        setComments(post.comments); // Setting comments associated with the post
      })
      .catch((error) => {
        setError(error.message); // Setting error message if fetching fails
      })
      .finally(() => {
        setIsLoading(false); // Setting loading status to false
      });
  };

  // Effects to handle post update and deletion
  useEffect(() => {
    setTimeout(() => {
      if (isPostUpdated) {
        setIsPostUpdated(false); // Resetting post update status
        fetchPostById(); // Fetching updated post data
      }
      if (isPostDeleted) {
        setIsPostDeleted(false); // Resetting post deletion status
        navigate("/"); // Navigating to home page after post deletion
      }
    }, 1000);
  }, [isPostUpdated, isPostDeleted]);

  // Effect to fetch post data on component mount
  useEffect(() => {
    setTimeout(() => {
      fetchPostById(); // Fetching post data
    }, 1000);
  }, []);

  // Rendering content based on loading status and error
  let content = <Loading />; // Default content is a loading spinner

  if (error) {
    content = <Banner className="text-danger border-danger" message={error} />; // Displaying error message if any
  }
  if (!isLoading && !error) {
    // Displaying post and comments if loading is complete and there are no errors
    content = (
      <Col className="d-flex flex-column justify-content-center">
        {/* Form for updating post */}
        <PostUpdateForm
          onSubmit={onPostUpdate}
          onPostDelete={onPostDelete}
          isDeletingPost={isDeletingPost}
          isPostDeleted={isPostDeleted}
          post={post}
        />
        {/* Banner for indicating post update */}
        {isPostUpdated && (
          <Banner
            className="text-success border-success mt-4"
            message={`${t("updatedBy", { type: "post" })} ${authCtx.userName}`}
          />
        )}
        {/* Banner for indicating post deletion */}
        {isPostDeleted && (
          <Banner
            className="text-danger border-danger mt-4"
            message={`${t("deleteBy", { type: "post" })} ${authCtx.userName}`}
          />
        )}

        {/* Displaying comments section if user is logged in or there are comments */}
        {(authCtx.isLoggedIn || comments.length > 0) && (
          <div className="ms-2 mt-3 mb-2">
            <h5>{t("comments")}</h5>
          </div>
        )}

        {/* Form for adding new comment if user is logged in */}
        {authCtx.isLoggedIn && (
          <NewCommentForm onContentChange={fetchPostById} postId={post.id} />
        )}
        {/* Displaying list of comments */}
        <CommentsList onContentChange={fetchPostById} comments={comments} />
      </Col>
    );
  }

  return (
    <Container>
      <Row
        className="pt-4 d-flex justify-content-center"
        style={{
          marginTop: props.headerHeight, // Adjusting top margin based on header height
          marginBottom: props.footerHeight, // Adjusting bottom margin based on footer height
        }}
      >
        {content}
      </Row>
    </Container>
  );
};

export default PostPage;
