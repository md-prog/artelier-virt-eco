import React from "react";
import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import SectionIntro from "../SubSections/SectionIntro";
import Title from "../SubSections/Title";
import EmptySpace from "../SubSections/EmptySpace";

const ThePioneers = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "The Pioneers" } }) {
                nodes {
                    ...SectionContent
                }
            }
        }
    `);

    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);
    return (
        <SectionContainer index={5} title={"The Pioneers"}>
            <EmptySpace style={{ height: "290vh" }} />

            <Title height="350vh" />
            <SectionIntro
                title={false}
                content={dataByKey["introduction"]}
                position={"center"}
            />
            <EmptySpace style={{ height: "70vh" }} />
            <SectionIntro
                content={dataByKey["profile_1"]}
                position={"center"}
            />
            <EmptySpace style={{ height: "70vh" }} />
            <SectionIntro
                content={dataByKey["profile_2"]}
                position={"center"}
            />

            <SectionIntro
                // style={{ visibility: "hidden" }}
                content={dataByKey["conclusion"]}
                title={false}
                position={"center"}
                id={"conclusion"}
                label={"conclusion"}
            />
            <EmptySpace style={{ height: "400vh" }} label={"conclusion"} />
            <EmptySpace style={{ height: "300vh" }} label={"conclusion"} />
            <EmptySpace style={{ height: "100vh" }} label={"conclusion"} />
        </SectionContainer>
    );
};

export default ThePioneers;
