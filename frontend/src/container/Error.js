import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 100vh;
  width: 100%;
`;

const Error = () => {
  return (
    <Container>
      <Typography variant="h2" sx={{ fontWeight: 900, color: "#d32f2f" }}>
        Fetching Error
      </Typography>
    </Container>
  );
};

export default Error;
