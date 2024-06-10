import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import PostThumbnailsList from "../Components/PostThumbnailsList"; // Importing PostThumbnailsList component
import Loading from "../Components/Loading"; // Importing Loading component
import Footer from "../Components/Footer/Footer"; // Importing the Footer component
import { getAllPosts } from "../lib/api"; // Importing getAllPosts function from API module

const MainPage = (props) => {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    // Effect to fetch posts when component mounts
    setTimeout(() => { // Simulating asynchronous operation
      getAllPosts().then((data) => { // Fetching posts
        setPosts(data); // Setting fetched posts
        setIsLoading(false); // Setting loading state to false
      });
    }, 1000); // Simulated delay before fetching posts
  }, []); // Empty dependency array ensures effect runs only once when component mounts

  return (
    <>
      <Container fluid> {/* Bootstrap Container component */}
        <Row
          xs={1}
          md={2}
          lg={3}
          className="g-4 pb-4 justify-content-center" // Bootstrap grid classes
          style={{
            marginTop: props.headerHeight, // Styling for top margin
            marginBottom: props.footerHeight, // Styling for bottom margin
          }}
        >
          {isLoading && <Loading />} {/* Displaying loading indicator if still loading */}
          {!isLoading && <PostThumbnailsList posts={posts} />} {/* Displaying post thumbnails list if not loading */}
        </Row>
      </Container>
      {!isLoading && <Footer />} {/* Displaying footer if not loading */}
    </>
  );
};

export default MainPage;
