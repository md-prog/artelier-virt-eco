import React from "react";
import styled from "@emotion/styled";

import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import SectionIntro from "../SubSections/SectionIntro";
import { respond } from "../../styles/responsive";
const Container = styled.div`
    padding-top: 150vh;
    position: relative;
`;
const QuoteContainer = styled.div`
    width: calc(70% - 0.4em);
    padding: 0.4em;
    max-width: 1260px;
    margin: 0 auto 50vh;
`;
const Quote = styled.blockquote`
    ${respond(37, 110, "px", "lineHeight")};
    ${respond(30, 90)};
    font-family: FoundryGridnik, sans-serif;
    display: inline;
    background-color: white;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    padding: 0 0.2em;
    color: black;
`;
const Introduction = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "Introduction" } }) {
                nodes {
                    ...SectionContent
                }
            }
        }
    `);
    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);
    return (
        <SectionContainer index={0} title={"Introduction"}>
            <Container>
                <QuoteContainer>
                    <Quote>
                        Just out of reach, behind a digital curtain, exists a
                        galaxy of activity. A new economic frontier that may be
                        the answer to the generational wealth gap.
                    </Quote>
                </QuoteContainer>
                <SectionIntro
                    content={dataByKey["introduction"]}
                    title={false}
                />
            </Container>
        </SectionContainer>
    );
};

export default Introduction;
