import React from "react";
import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import SectionIntro from "../SubSections/SectionIntro";
import Title from "../SubSections/Title";
import CitizenProfile from "../SubSections/CitizenProfile";
import EmptySpace from "../SubSections/EmptySpace";
const ThePopulation = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "The Population" } }) {
                nodes {
                    ...SectionContent
                }
            }
            allPrismicCitizenProfiles(
                filter: { tags: { eq: "The Population" } }
            ) {
                nodes {
                    data {
                        avatar_image {
                            fluid {
                                ...GatsbyPrismicImageFluid
                            }
                            alt
                        }
                        citizen_content {
                            html
                        }
                        content {
                            html
                        }
                        introduction {
                            html
                        }
                        highlight
                        irl_image {
                            fluid {
                                ...GatsbyPrismicImageFluid
                            }
                            alt
                        }
                        key
                        citizen
                    }
                }
            }
        }
    `);

    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);
    let citizenProfilesByKey = keyBy(
        data.allPrismicCitizenProfiles.nodes,
        val => val.data.key
    );
    return (
        <SectionContainer index={2} title={"The Population"}>
            <Title height={"400vh"} />
            <EmptySpace style={{ height: "200vh" }} />
            <EmptySpace style={{ height: "100vh" }} />
            <SectionIntro
                title={false}
                content={dataByKey["introduction"]}
                position={"center"}
            />
            <CitizenProfile content={citizenProfilesByKey["grandpagaming"]} />
            <CitizenProfile content={citizenProfilesByKey["matty"]} />
            <CitizenProfile content={citizenProfilesByKey["mittani"]} />
            <CitizenProfile content={citizenProfilesByKey["estelle"]} />
            <CitizenProfile content={citizenProfilesByKey["eltetra"]} />
            <CitizenProfile content={citizenProfilesByKey["sikander"]} />
        </SectionContainer>
    );
};

export default ThePopulation;
