import React, { useState } from "react";
import SectionContainer from "../Platform/SectionContainer";
import { graphql, useStaticQuery } from "gatsby";
import keyBy from "lodash/keyBy";
import WorkerProfile from "../SubSections/WorkerProfile";
import Workers from "../Content/Workers/Workers";
import styled from "@emotion/styled";
import sword from "../../data/the-workers/sword.svg";
import dota2 from "../../data/the-workers/dota2.svg";
import twitch from "../../data/the-workers/twitch.svg";
import WorkersIntroduction from "../SubSections/WorkersIntroduction";
import WorkersBackground from "../Decorations/WorkersBackground";

const Profiles = styled.div`
    position: relative;
`;
const Lines = styled.div`
    background-color: ${({ color }) => color};
    flex: 1;
    height: 3px;
    position: relative;
    transition: background-color 0.3s;
    &:before,
    &:after {
        content: " ";
        height: 3px;
        background-color: ${({ color }) => color};
        width: 100%;
        position: absolute;
    }
    &:before {
        top: -8px;
    }
    &:after {
        bottom: -8px;
    }
`;
const ProfileHeader = styled.div`
    position: sticky;
    top: 0;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 8;
`;
const ProfileTitle = styled.div`
    text-transform: uppercase;
    color: ${({ color }) => color};
    display: block;
    font-size: 34px;
    line-height: 30px;
    height: 34px;
    padding: 0 10px;
    transition: background-color 0.3s;
    font-family: Pixelar, sans-serif;
`;

const WorkersContainer = styled.div`
    width: 100%;
    position: relative;
    background-color: black;
`;
const TheWorkers = ({ ...props }) => {
    const [profileHeaderColor, setProfileHeaderColor] = useState("#0000FF");
    const data = useStaticQuery(graphql`
        {
            allPrismicSection(filter: { tags: { eq: "The Workers" } }) {
                nodes {
                    ...SectionContent
                }
            }
            prismicWorkers {
                data {
                    key
                    profiles {
                        color
                        description {
                            html
                        }
                        image {
                            url
                            dimensions {
                                height
                                width
                            }
                        }
                        income_range
                        income_range_percentage
                        income_streams
                        key_platforms
                        population_graph_percentage
                        population_size
                        title {
                            text
                        }
                        types_of_employment
                    }
                    title {
                        text
                    }
                    content {
                        html
                    }
                }
            }
        }
    `);
    let dataByKey = keyBy(data.allPrismicSection.nodes, val => val.data.key);
    return (
        <SectionContainer index={3} title={"The Workers"}>
            <WorkersContainer>
                <WorkersBackground />
                <WorkersIntroduction content={data.prismicWorkers.data} />
                <Workers data={data.prismicWorkers} />
            </WorkersContainer>
            <Profiles>
                <ProfileHeader>
                    <Lines color={profileHeaderColor} />
                    <ProfileTitle color={profileHeaderColor}>
                        Workers
                    </ProfileTitle>
                    <Lines color={profileHeaderColor} />
                </ProfileHeader>
                <WorkerProfile
                    color={"#0000FF"}
                    setColor={setProfileHeaderColor}
                    content={dataByKey["modder"]}
                    image={sword}
                    imageWidth={3}
                    imagePositionsLeft={[
                        {
                            left: "33%",
                            top: "72px",
                            transform: "rotate(-22deg)",
                        },
                        {
                            right: 0,
                            top: "149px",
                            transform: "rotate(193deg)",
                        },
                        {
                            left: "28%",
                            top: "500px",
                        },
                        {
                            right: "7%",
                            top: "610px",
                            transform: "rotate(135deg)",
                        },
                    ]}
                    imagePositionsRight={[
                        {
                            left: "7.14%",
                            top: "149px",
                            transform: "rotate(-22deg)",
                        },
                        {
                            right: "21.4%",
                            top: "72px",
                            transform: "rotate(193deg)",
                        },
                        {
                            left: "14.4%",
                            top: "550px",
                        },
                        {
                            right: "28.5%",
                            top: "410px",
                            transform: "rotate(135deg)",
                        },
                    ]}
                />
                <WorkerProfile
                    color={"#00009F"}
                    setColor={setProfileHeaderColor}
                    content={dataByKey["esports_pro"]}
                    image={dota2}
                    imageWidth={4}
                    imagePositionsLeft={[
                        {
                            left: "13%",
                            top: "200px",
                            transform: "rotate(-22deg)",
                        },
                        {
                            right: 0,
                            top: "72px",
                        },
                        {
                            left: "28%",
                            top: "680px",
                        },
                        {
                            right: "7%",
                            top: "410px",
                            transform: "rotate(25deg)",
                        },
                    ]}
                    imagePositionsRight={[
                        {
                            left: "22%",
                            top: "250px",
                            transform: "rotate(-22deg)",
                        },
                        {
                            right: 0,
                            top: "72px",
                        },
                        {
                            left: "7%",
                            top: "680px",
                        },
                        {
                            right: "23%",
                            top: "510px",
                            transform: "rotate(25deg)",
                        },
                    ]}
                />
                <WorkerProfile
                    color={"#9229F6"}
                    setColor={setProfileHeaderColor}
                    content={dataByKey["streamer"]}
                    image={twitch}
                    imageWidth={4}
                    imagePositionsLeft={[
                        {
                            left: "12%",
                            top: "242px",
                            transform: "rotate(16deg)",
                        },
                        {
                            right: "15.8%",
                            top: "72px",
                            transform: "rotate(-20deg)",
                        },
                        {
                            left: "12%",
                            top: "610px",
                            transform: "rotate(-20deg)",
                        },
                        {
                            right: "7%",
                            top: "410px",
                            transform: "rotate(-16deg)",
                        },
                    ]}
                    imagePositionsRight={[
                        {
                            left: "7.14%",
                            top: "249px",
                            transform: "rotate(-12deg)",
                        },
                        {
                            right: "7.4%",
                            top: "72px",
                            transform: "rotate(21deg)",
                        },
                        {
                            left: "14.4%",
                            top: "650px",
                            transform: "rotate(-12deg)",
                        },
                        {
                            right: "12.5%",
                            top: "460px",
                            transform: "rotate(27deg)",
                        },
                    ]}
                />
            </Profiles>
        </SectionContainer>
    );
};

export default TheWorkers;
