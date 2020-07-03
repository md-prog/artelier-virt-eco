import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
    display: ${({ visible }) => (visible ? "block" : "none")};
    transform: translate3d(-50%, -50%, 0);
    width: 30px;
    height: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
`;

const AnimationContainer = styled.div`
    border-radius: 50%;

    animation: 1.2s linear 0s infinite running spin;
    width: 30px;
    height: 30px;
    svg {
        width: 30px;
        height: 30px;
    }

    @keyframes spin {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
const Spinner = ({ visible }) => {
    return (
        <Container visible={visible}>
            <AnimationContainer>
                <svg
                    width="200px"
                    height="200px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="32"
                        strokeWidth="8"
                        stroke="#ffffff"
                        strokeDasharray="50.26548245743669 50.26548245743669"
                        fill="none"
                        strokeLinecap="round"
                        transform="matrix(1,0,0,1,0,0)"
                    ></circle>
                </svg>
            </AnimationContainer>
        </Container>
    );
};

export default Spinner;
