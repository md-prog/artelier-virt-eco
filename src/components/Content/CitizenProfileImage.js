import React from "react";
import Img from "gatsby-image";
import styled from "@emotion/styled";
import { breakpoints, respond } from "../../styles/responsive";
import gridSizing from "../../styles/gridSizing";
import { css } from "@emotion/core";

const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.image, "gridColumn")};
    display: grid;

    ${gridSizing(2, ["gridColumnGap"])};
    position: relative;
    ${gridSizing(2, ["paddingTop", "paddingLeft", "paddingRight"])};

    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    grid-template-rows: 1fr;
    grid-template-columns: auto;
    @media screen and (min-width: 450px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
    }
`;
const StyledImage = styled(Img)`
    position: relative;
    z-index: 2;
    width: 100%;
`;
const ImageWrapper = styled.div`
    position: relative;
    ${gridSizing(5, ["marginLeft", "marginRight"])};
    margin-bottom: 35px;

    @media screen and (min-width: 450px) {
        grid-row: 2;
        grid-column: auto;
        margin: 0;
    }
`;
const Corner = styled.div`
    position: absolute;
    left: ${({ left }) => (left ? 0 : null)};
    right: ${({ left }) => (!left ? 0 : null)};
    top: ${({ top }) => (top ? 0 : null)};
    bottom: ${({ top }) => (!top ? 0 : null)};
    width: 10px;
    height: 10px;
    z-index: 3;
    background-color: ${({ theme }) =>
        theme.highlight ? theme.highlight : "white"};
    &:before,
    &:after {
        content: " ";
        position: absolute;
        width: 10px;
        height: 10px;
        z-index: 3;
        background-color: ${({ theme }) =>
            theme.highlight ? theme.highlight : "white"};
    }
    &:before {
        top: ${({ top }) => (top ? "-5px" : null)};
        bottom: ${({ top }) => (!top ? "-5px" : null)};
        left: ${({ left }) => (left ? "5px" : null)};
        right: ${({ left }) => (!left ? "5px" : null)};
    }
    &:after {
        top: ${({ top }) => (top ? "5px" : null)};
        bottom: ${({ top }) => (!top ? "5px" : null)};
        left: ${({ left }) => (left ? "-5px" : null)};
        right: ${({ left }) => (!left ? "-5px" : null)};
    }
`;
const Border = styled.div`
    position: absolute;
    ${({ position }) => {
        switch (position) {
            case "top":
                return css`
                    top: -10px;
                    left: 10px;
                    width: calc(100% - 20px);
                    height: 10px;
                `;
            case "left":
                return css`
                    top: 10px;
                    left: -10px;
                    height: calc(100% - 20px);
                    width: 10px;
                `;
            case "right":
                return css`
                    top: 10px;
                    right: -10px;
                    height: calc(100% - 20px);
                    width: 10px;
                `;
            case "bottom":
            default:
                return css`
                    bottom: -10px;
                    left: 10px;
                    width: calc(100% - 20px);
                    height: 10px;
                `;
        }
    }};

    background-color: ${({ theme }) =>
        theme.highlight ? theme.highlight : "white"};
`;

const Caption = styled.figcaption`
    text-align: center;
    font-family: ${({ theme }) =>
        theme.bodyFont ? theme.bodyFont : `FoundryGridnik, sans-serif`};
    font-size: 20px;
    ${respond(16, 20)};
    line-height: 1.3;
    font-weight: 500;
    margin-bottom: 20px;
    @media screen and (min-width: 450px) {
        grid-row: 1;
        grid-column: auto;
        margin-bottom: 38px;
    }
`;
const Highlight = styled.h4`
    color: ${({ theme }) => (theme.highlight ? theme.highlight : "white")};
`;
const CitizenProfileImage = ({ irl, avatar }) => {
    return (
        <Container>
            <Caption>
                <Highlight>IRL: </Highlight>
                {irl.alt}
            </Caption>
            <ImageWrapper>
                <Corner top={true} left={true} />
                <Corner top={true} left={false} />
                <Corner top={false} left={true} />
                <Corner top={false} left={false} />
                <Border position={"top"} />
                <Border position={"left"} />
                <Border position={"bottom"} />
                <Border position={"right"} />

                {irl.fluid ? (
                    <StyledImage fluid={{ ...irl.fluid, sizes: "" }} />
                ) : (
                    <img src={irl.url} alt={""} />
                )}
            </ImageWrapper>

            <Caption>
                <Highlight>In-game: </Highlight>
                {avatar.alt}
            </Caption>
            <ImageWrapper>
                <Corner top={true} left={true} />
                <Corner top={true} left={false} />
                <Corner top={false} left={true} />
                <Corner top={false} left={false} />
                <Border position={"top"} />
                <Border position={"left"} />
                <Border position={"bottom"} />
                <Border position={"right"} />
                {avatar.fluid ? (
                    <StyledImage fluid={{ ...avatar.fluid, sizes: "" }} />
                ) : (
                    <img src={avatar.url} alt={""} />
                )}
            </ImageWrapper>
        </Container>
    );
};
export default CitizenProfileImage;
