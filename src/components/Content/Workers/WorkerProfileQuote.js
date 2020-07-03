import React from "react";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../../../styles/responsive";
const Container = styled.div`
    position: relative;
    ${({ theme }) => breakpoints(theme.position.smallQuote, "gridColumn")};
    background-color: white;
    font-family: "Pixelar";
    color: ${({ theme }) => theme.highlightColor};
    ${({ theme }) =>
        respond(theme.smallQuoteFontSize.min, theme.smallQuoteFontSize.max)};
    line-height: 1.2;
    border-top: 20px solid ${({ theme }) => theme.highlightColor};
    border-bottom: 20px solid ${({ theme }) => theme.highlightColor};
    text-align: center;

    padding: 80px ${100 / 24}vw;
    @media screen and (min-width: 800px) {
        padding: 80px ${100 / 48}vw;
    }
    @media screen and (min-width: 1800px) {
        padding: 80px ${1800 / 48}px;
    }
`;
const Quote = styled.blockquote``;

const Side = styled.div`
    position: absolute;
    height: calc(100% - 40px);
    width: 20px;
    background-color: ${({ theme }) => theme.highlightColor};
    left: ${({ position }) => (position === "left" ? "-40px" : null)};
    right: ${({ position }) => (position === "right" ? "-40px" : null)};
    top: 20px;
    &:before,
    &:after {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: ${({ theme }) => theme.highlightColor};
        content: " ";
    }
    &:before {
        top: -20px;
        right: ${({ position }) => (position === "left" ? "-20px" : "20px")};
    }
    &:after {
        bottom: -20px;
        right: ${({ position }) => (position === "left" ? "-20px" : "20px")};
    }
`;
const StartQuote = styled.div`
    position: absolute;
    top: 25px;
    left: 10px;
    path {
        fill: ${({ theme }) => theme.highlightColor};
    }
`;
const EndQuote = styled.div`
    position: absolute;
    bottom: 25px;
    right: 10px;
    path {
        fill: ${({ theme }) => theme.highlightColor};
    }
`;

const WorkerProfileQuote = ({ data, ...props }) => {
    return (
        <Container>
            <Side position={"left"} />
            <Side position={"right"} />
            <StartQuote>
                <svg
                    width="42"
                    height="31"
                    viewBox="0 0 42 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M15.6112 1.48915e-05L15.6112 5.16684L10.4075 5.16684L10.4075 1.44366e-05L15.6112 1.48915e-05ZM36.4262 15.5005L41.6299 15.5005L41.6299 31.001L26.0187 31.001L26.0187 10.3337L31.2224 10.3337L31.2224 5.16684L36.4262 5.16684L36.4262 15.5005ZM10.4075 15.5005L15.6112 15.5005L15.6112 31.001L2.28882e-05 31.001L2.4695e-05 10.3337L5.20376 10.3337L5.20376 5.16684L10.4075 5.16684L10.4075 15.5005ZM41.6299 1.71661e-05L41.6299 5.16684L36.4262 5.16684L36.4262 1.67112e-05L41.6299 1.71661e-05Z"
                        fill="black"
                    />
                </svg>
            </StartQuote>
            <EndQuote>
                <svg
                    width="47"
                    height="35"
                    viewBox="0 0 47 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M29.375 35V29.1667H35.25V35H29.375ZM5.875 17.5H0V0H17.625V23.3333H11.75V29.1667H5.875V17.5ZM35.25 17.5H29.375V0H47V23.3333H41.125V29.1667H35.25V17.5ZM0 35V29.1667H5.875V35H0Z"
                        fill="black"
                    />
                </svg>
            </EndQuote>
            <Quote
                dangerouslySetInnerHTML={{ __html: data.primary.content.html }}
            />
        </Container>
    );
};

export default WorkerProfileQuote;
