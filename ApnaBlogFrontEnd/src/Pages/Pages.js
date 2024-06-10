import React, { useContext } from "react";
import MainPage from "./MainPage"; // Importing the MainPage component
import LoginPage from "./LoginPage"; // Importing the LoginPage component
import RegisterPage from "./RegisterPage"; // Importing the RegisterPage component
import NewPostPage from "./NewPostPage"; // Importing the NewPostPage component
import PostPage from "./PostPage"; // Importing the PostPage component
import { Navigate, Route, Routes } from "react-router-dom"; // Importing routing components from React Router
import AuthContext from "../store/auth-context"; // Importing authentication context
import AboutUs from "./about"; // Importing the AboutUs component

const Pages = (props) => {
  const authCtx = useContext(AuthContext); // Accessing authentication context

  return (
    <Routes>
      {/* Route for LoginPage - rendered if user is not logged in */}
      {!authCtx.isLoggedIn && (
        <Route
          path="/login"
          element={
            <LoginPage
              headerHeight={props.headerHeight}
              footerHeight={props.footerHeight}
            />
          }
        ></Route>
      )}

      {/* Route for RegisterPage - rendered if user is not logged in */}
      {!authCtx.isLoggedIn && (
        <Route
          path="/register"
          element={
            <RegisterPage
              headerHeight={props.headerHeight}
              footerHeight={props.footerHeight}
            />
          }
        ></Route>
      )}

      {/* Route for NewPostPage - rendered if user is logged in, else navigates to home */}
      <Route
        path="/new-post"
        element={
          authCtx.isLoggedIn ? (
            <NewPostPage
              headerHeight={props.headerHeight}
              footerHeight={props.footerHeight}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      ></Route>

      {/* Route for AboutUs page */}
      <Route
        path="/about-us"
        element={<AboutUs />}
      ></Route>

      {/* Route for PostPage */}
      <Route
        path="/post/:id"
        element={
          <PostPage
            headerHeight={props.headerHeight}
            footerHeight={props.footerHeight}
          />
        }
      ></Route>

      {/* Default route - renders MainPage */}
      <Route
        path="/"
        element={
          <MainPage
            headerHeight={props.headerHeight}
            footerHeight={props.footerHeight}
          />
        }
      ></Route>

      {/* Redirects to home if the URL doesn't match any route */}
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default Pages;
