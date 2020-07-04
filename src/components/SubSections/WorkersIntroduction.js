import React from "react";
import styled from "@emotion/styled";
import title from "../../data/the-workers/the-workers.svg";
import { respond } from "../../styles/responsive";
import Asteroid from "../Decorations/Asteroid";
import ParallaxContainer from "../Parallax/ParallaxContainer";
const Container = styled.div`
    width: 100%;
    ${respond(50, 200, "px", "paddingTop")};
    overflow-x: hidden;
`;
const Title = styled.h1`
    width: 100%;
    max-width: 1800px;
    margin: 0 auto 200px auto;
    position: relative;
    display: flex;
`;
const TitleInner = styled.div`
    margin: auto;
    width: 100%;
    position: relative;
`;
const Content = styled.div`
    text-transform: uppercase;
    font-family: Pixelar, sans-serif;
    width: 100%;
    max-width: 1320px;
    padding: 0 40px;
    ${respond(20, 42)};
    margin: 0 auto;
    text-align: center;
    p {
        margin-bottom: 40px;
    }
`;
const TitleSVG = styled.img`
    width: 73%;
    margin: 0 auto;
    display: block;
`;

const WorkersIntroduction = ({ content }) => {
    return (
        <ParallaxContainer>
            <Container>
                <Title>
                    <TitleInner>
                        <TitleSVG src={title} />
                        <Asteroid
                            asteroid={2}
                            width={"1.6%"}
                            position={{ top: "-5%", left: "0%" }}
                            parallax={{ from: -100, to: 100 }}
                        />
                        <Asteroid
                            asteroid={1}
                            width={"5%"}
                            position={{
                                top: "10%",
                                left: "60%",
                            }}
                            transform={"rotate(-90deg)"}
                            parallax={{ from: -50, to: 300 }}
                        />
                        <Asteroid
                            asteroid={0}
                            width={"6.2%"}
                            transform={"rotate(-50deg) scale(1, -1)"}
                            position={{
                                top: "-15%",
                                right: "0%",
                            }}
                            parallax={{ from: -20, to: 500 }}
                        />
                        <Asteroid
                            asteroid={1}
                            width={"5%"}
                            position={{
                                bottom: "-10%",
                                right: "0%",
                            }}
                            parallax={{ from: -100, to: 300 }}
                        />
                        <Asteroid
                            asteroid={2}
                            width={"1.6%"}
                            position={{
                                bottom: "-20%",
                                right: "20%",
                            }}
                            parallax={{ from: -80, to: 350 }}
                        />
                        <Asteroid
                            asteroid={0}
                            width={"6.2%"}
                            transform={"rotate(100deg)"}
                            position={{
                                bottom: "-25%",
                                left: "0%",
                            }}
                            parallax={{ from: -80, to: 50 }}
                        />
                    </TitleInner>
                </Title>
                <Content
                    dangerouslySetInnerHTML={{ __html: content.content.html }}
                />
            </Container>
        </ParallaxContainer>
    );
};

export default WorkersIntroduction;
