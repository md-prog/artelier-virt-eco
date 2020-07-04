import React from "react";
import styled from "@emotion/styled";
import { breakpoints } from "../styles/responsive";
import gridSizing from "../styles/gridSizing";
const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.imageViz, "gridColumn")};
    ${gridSizing(2, ["paddingTop", "paddingBottom"])};
`;

const Picture = styled.picture`
    img {
        width: 100%;
    }
`;

const ImageViz = ({ data: { primary } }) => {
    return (
        <Container>
            <Picture>
                <source
                    srcSet={primary.image.url}
                    media={"(min-width: 800px)"}
                />
                <img src={primary.image.thumbnails.Mobile.url} alt="" />
            </Picture>
        </Container>
    );
};

export default ImageViz;
