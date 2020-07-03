import React from "react";
import Img from "gatsby-image";
import styled from "@emotion/styled";
import { breakpoints } from "../styles/responsive";

const skewSize = 16;

const Container = styled.figure`
    ${({ theme }) => breakpoints(theme.position.image, "gridColumn")};
`;
const StyledImage = styled(Img)`
    position: relative;
    z-index: 2;
`;
const ImageContainer = styled.div`
    position: relative;
`;
const BorderContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 20px 0;

    &:before,
    &:after {
        position: absolute;
        content: " ";
        left: 20px;
        right: 20px;
        height: 20px;
        background-color: ${({ theme }) => theme.highlightColor};
    }
    &:before {
        bottom: -20px;
    }
    &:after {
        top: -20px;
    }
`;
const Side = styled.div`
    position: absolute;
    height: calc(100% - 40px);
    width: 20px;
    background-color: ${({ theme }) => theme.highlightColor};
    left: ${({ position }) => (position === "left" ? "-20px" : null)};
    right: ${({ position }) => (position === "right" ? "-20px" : null)};
    top: 20px;
    z-index: 3;
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

const Caption = styled.figcaption`
    margin-top: ${skewSize + 21}px;
    padding: 0 20px;
    align-self: center;
    font-family: ${({ theme }) =>
        theme.bodyFont ? theme.bodyFont : `FoundryGridnik, sans-serif`};
    font-size: 14px;
    background-color: ${({ theme }) =>
        theme.type === "SectionIntro" ? "rgba(0,0,0,0.95)" : "white"};
`;
const ProfileImage = ({ data: { primary } }) => {
    return (
        <Container>
            <BorderContainer>
                <Side position={"left"} />
                <Side position={"right"} />
                <ImageContainer highlight={primary.highlight}>
                    {primary.image.fluid ? (
                        <StyledImage
                            fluid={{ ...primary.image.fluid, sizes: "" }}
                        />
                    ) : (
                        <img src={primary.image.url} alt={""} />
                    )}
                </ImageContainer>
            </BorderContainer>
            {primary.caption.html && (
                <Caption
                    dangerouslySetInnerHTML={{ __html: primary.caption.html }}
                />
            )}
        </Container>
    );
};
export default ProfileImage;
