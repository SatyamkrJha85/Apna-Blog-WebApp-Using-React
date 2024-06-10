import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (

    <div className="w-auto d-flex align-content-center text-bright" style={{ marginTop:"120px"}}>
      <Spinner
        as="span"
        animation="border"
        size="lg"
        role="status"
        aria-hidden="true"
      />
      <span className="ms-2">
        <h3>Loading...</h3>
      </span>
    </div>
  );
};

export default Loading;
