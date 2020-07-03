import React from "react";
import styled from "@emotion/styled";
import stars from "../../data/the-workers/asteroids/stars.png";

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;
const Stars = styled.div`
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-image: url(${stars});
    background-position: center center;
`;

const WorkersBackground = () => {
    return (
        <Container>
            <Stars />
        </Container>
    );
};

export default WorkersBackground;
