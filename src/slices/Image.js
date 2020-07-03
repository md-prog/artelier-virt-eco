import React from "react";
import Img from "gatsby-image";
import styled from "@emotion/styled";
import { breakpoints } from "../styles/responsive";

const skewSize = 16;

const Container = styled.figure`
    ${({ theme }) => breakpoints(theme.position.image, "gridColumn")};
    display: flex;
    flex-direction: column;
    margin: 56px 0;
`;
const StyledImage = styled(Img)`
    position: relative;
    z-index: 2;
`;
const ImageContainer = styled.div`
    position: relative;
    border: 5px solid #a243ff;
`;

const Caption = styled.figcaption`
    margin-top: ${skewSize + 11}px;

    align-self: center;
    font-family: ${({ theme }) =>
        theme.bodyFont ? theme.bodyFont : `FoundryGridnik, sans-serif`};
    font-size: 14px;
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    padding: 10px;

    @media screen and (min-width: 800px) {
        align-self: flex-end;
    }
`;
const Image = ({ data: { primary } }) => {
    return (
        <Container>
            <ImageContainer highlight={primary.highlight}>
                {primary.image.fluid ? (
                    <StyledImage
                        fluid={{ ...primary.image.fluid, sizes: "" }}
                    />
                ) : (
                    <img src={primary.image.url} alt={""} />
                )}
            </ImageContainer>
            {primary.caption.html && (
                <Caption
                    dangerouslySetInnerHTML={{ __html: primary.caption.html }}
                />
            )}
        </Container>
    );
};
export default Image;
