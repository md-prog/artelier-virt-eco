import React from "react";
import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import SectionIntro from "../SubSections/SectionIntro";
import EmptySpace from "../SubSections/EmptySpace";
import Title from "../SubSections/Title";

const TheUnderground = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "The Underground" } }) {
                nodes {
                    ...SectionContent
                }
            }
        }
    `);
    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);
    return (
        <SectionContainer index={4} title={"The Underground"}>
            <EmptySpace style={{ height: "200vh" }} />
            <Title height="200vh" />
            <EmptySpace style={{ height: "200vh" }} />
            {dataByKey["introduction"] && (
                <SectionIntro
                    content={dataByKey["introduction"]}
                    position={"left"}
                    alternateTitle={true}
                    style={{ paddingBottom: "100vh" }}
                />
            )}
            {dataByKey["vcg_ecosystem"] && (
                <SectionIntro
                    content={dataByKey["vcg_ecosystem"]}
                    title={true}
                    position={"left"}
                    style={{ paddingBottom: "100vh" }}
                />
            )}
            {dataByKey["grey_markets"] && (
                <SectionIntro
                    content={dataByKey["grey_markets"]}
                    title={true}
                    position={"left"}
                    style={{ paddingBottom: "100vh" }}
                />
            )}
            {dataByKey["new_business"] && (
                <SectionIntro
                    content={dataByKey["new_business"]}
                    title={true}
                    position={"left"}
                    style={{ paddingBottom: "100vh" }}
                />
            )}
            {dataByKey["black_markets"] && (
                <SectionIntro
                    content={dataByKey["black_markets"]}
                    title={true}
                    position={"center"}
                />
            )}
        </SectionContainer>
    );
};

export default TheUnderground;
