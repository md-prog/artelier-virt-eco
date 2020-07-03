import React from "react";
import styled from "@emotion/styled";
import { breakpoints } from "../../styles/responsive";
import { respond } from "../../styles/responsive";

const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.smallQuote, "gridColumn")};
    blockquote {
        ${({ theme }) =>
            respond(
                theme.smallQuoteFontSize.min,
                theme.smallQuoteFontSize.max
            )};
        line-height: 1.355;
        padding: 70px ${(100 / 24) * 2}vw;
        @media screen and (min-width: 800px) {
            padding: 70px ${(100 / 48) * 2}vw;
        }
        @media screen and (min-width: 1800px) {
            padding: 70px ${(1800 / 48) * 2}px;
        }
        background-color: ${({ theme }) =>
            theme.mobileBackgroundColor
                ? theme.mobileBackgroundColor
                : theme.backgroundColor};
        @media screen and (min-width: 800px) {
            background-color: ${({ theme }) => theme.backgroundColor};
        }
        font-family: FoundryGridnik, sans-serif;
        color: white;
        p {
            display: inline;
            //background-color: white;
            //box-decoration-break: clone;
            //-webkit-box-decoration-break: clone;
            //padding: 0 0.2em;
        }
    }
`;
const SmallQuote = ({ data }) => {
    return (
        <Container>
            <blockquote
                dangerouslySetInnerHTML={{ __html: data.content.html }}
            />
        </Container>
    );
};

export default SmallQuote;
