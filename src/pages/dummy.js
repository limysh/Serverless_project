import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";

const Dummy = () => {
  const location = useLocation();

  // Access the state sent via the navigate function
  const state = location.state;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dummy Page
      </Typography>
      <Typography variant="h6" gutterBottom>
        User ID: {state?.userId}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Game ID: {state?.game_Id}
      </Typography>
      {/* Display other state data if needed */}
    </Container>
  );
};

export default Dummy;
