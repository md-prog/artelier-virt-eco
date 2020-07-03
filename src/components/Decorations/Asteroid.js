import React from "react";
import styled from "@emotion/styled";
import asteroid1 from "../../data/the-workers/asteroids/asteroid-1.png";
import asteroid2 from "../../data/the-workers/asteroids/asteroid-2.png";
import asteroid3 from "../../data/the-workers/asteroids/asteroid-3.png";
import ParallaxLayer from "../Parallax/ParallaxLayer";
const asteroids = [asteroid1, asteroid2, asteroid3];
const Container = styled.div`
    width: ${({ width }) => width};

    position: absolute;
`;
const Image = styled.img`
    width: 100%;
    height: auto;
    transform-origin: center center;
    transform: ${({ transform }) => transform};
`;
const Asteroid = ({ asteroid, width, position, transform, parallax }) => {
    return (
        <Container css={position} width={width}>
            <ParallaxLayer {...parallax}>
                <Image transform={transform} src={asteroids[asteroid]} />
            </ParallaxLayer>
        </Container>
    );
};

export default Asteroid;
