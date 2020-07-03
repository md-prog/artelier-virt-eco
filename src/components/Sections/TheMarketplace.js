import React from "react";
import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import SectionIntro from "../SubSections/SectionIntro";
import EmptySpace from "../SubSections/EmptySpace";
import WhiteCaseStudy from "../SubSections/WhiteCaseStudy";
import Title from "../SubSections/Title";
import OpenSeaTicker from "../OpenSeaTicker";

const TheMarketplace = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "The Marketplaces" } }) {
                nodes {
                    ...SectionContent
                }
            }
        }
    `);
    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);

    return (
        <SectionContainer index={1} title={"The Marketplaces"}>
            <EmptySpace style={{ height: "150vh" }} />
            <Title height="250vh" />
            <SectionIntro
                title={false}
                content={dataByKey["marketplaces_introduction"]}
                position={"center"}
                style={{ paddingBottom: "100vh", paddingTop: "200vh" }}
            />
            <SectionIntro
                subTitle={"Part 1"}
                position={`right`}
                content={dataByKey["closed_centralised_marketplaces"]}
            />
            <WhiteCaseStudy
                parentTitle={"Closed centralised Marketplaces"}
                position={`right`}
                content={dataByKey["case_study_fortnite"]}
            />

            <SectionIntro
                style={{ paddingTop: "50vh" }}
                subTitle={"Part 2"}
                position={`left`}
                content={dataByKey["open_centralised_marketplaces"]}
            />
            <WhiteCaseStudy
                parentTitle={"Open centralised marketplaces"}
                position={`left`}
                content={dataByKey["case_study_minecraft"]}
            />
            <SectionIntro
                position={"left"}
                title={false}
                content={dataByKey["outro_2"]}
                style={{ paddingBottom: "100vh", paddingTop: "50vh" }}
            />
            <div css={{ position: "relative" }}>
                <OpenSeaTicker />
                <SectionIntro
                    subTitle={"Part 3"}
                    position={"center"}
                    content={dataByKey["distributed_open_markets"]}
                />
            </div>

            <WhiteCaseStudy
                parentTitle={"Distributed open marketplaces"}
                content={dataByKey["case_study_decentraland"]}
            />
            <SectionIntro
                style={{ paddingBottom: "50vh", paddingTop: "50vh" }}
                title={false}
                content={dataByKey["outro_3"]}
            />
        </SectionContainer>
    );
};

export default TheMarketplace;
