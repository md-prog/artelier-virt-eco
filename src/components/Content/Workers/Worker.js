import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Border, Corner } from "./border";
import WorkerModal from "./WorkerModal";
import { respond } from "../../../styles/responsive";

const Container = styled.div`
    position: relative;

    display: flex;
    font-family: Pixelar, sans-serif;
    //padding-right: 100px;
    margin: 16px 16px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.9);

    width: 40vw;
    min-width: 234px;
    max-width: 715px;
    height: 182px;
    @media screen and (min-width: 600px) {
        height: 446px;
        min-width: 600px;
    }

    &:hover {
        ${Corner} {
            background-color: white;
            &:before,
            &:after {
                background-color: white;
            }
        }
        ${Border} {
            background-color: white;
        }
    }
`;

const ImageContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0 2.3vw;
    @media screen and (min-width: 600px) {
        margin: 0 4.6vw;
    }
    @media screen and (min-width: 800px) {
        margin: 0 82px;
    }
`;
const Image = styled.img`
    width: 71px;
    //height: 228px;
    height: 58.2%;
`;
const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 50px 0;
    margin-right: 2.3vw;
    @media screen and (min-width: 600px) {
        margin-right: 4.6vw;
    }
`;
const Title = styled.h2`
    text-transform: uppercase;
    ${respond(20, 50)};
    line-height: 0.7;
    color: ${({ theme }) => theme.color};
    margin-bottom: 10px;
`;
export const GraphContainer = styled.div`
    height: 14px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color};
    padding: 2px;
    margin-bottom: 10px;
    display: none;
    @media screen and (min-width: 600px) {
        display: block;
    }
`;
export const GraphBar = styled.div`
    height: 100%;
    width: ${({ width }) => width}%;
    background-color: ${({ theme }) => theme.color};
`;
const SubTitle = styled.h3`
    ${respond(17, 22)};
    margin-bottom: 8px;
    color: ${({ theme }) => theme.color};
`;
const Text = styled.div`
    ${respond(16, 21)};
`;
const Section = styled.div`
    margin-bottom: 10px;

    ${({ hideMobile = false }) =>
        hideMobile &&
        css`
            display: none;
            @media screen and (min-width: 600px) {
                display: block;
            }
        `};

    &:last-of-type {
        margin-bottom: 0;
    }
`;
const ModalTrigger = styled.button`
    appearance: none;
    background: none;
    border: 0;
    color: ${({ theme }) => theme.color};
    font-family: Pixelar, sans-serif;
    ${respond(16, 21)};
    text-decoration: underline;
`;

const Worker = ({ content, showModal, hideModal }) => {
    const {
        color,
        image,
        income_range,
        income_range_percentage,
        key_platforms,
        population_graph_percentage,
        population_size,
        title,
    } = content;
    return (
        <Container
            onClick={() =>
                showModal(
                    <WorkerModal content={content} hideModal={hideModal} />
                )
            }
            data-track={"worker-card"}
        >
            <ThemeProvider theme={{ color: color }}>
                <Corner top={true} left={true} />
                <Corner top={true} left={false} />
                <Corner top={false} left={true} />
                <Corner top={false} left={false} />
                <Border position={"top"} />
                <Border position={"left"} />
                <Border position={"bottom"} />
                <Border position={"right"} />
                <ImageContainer>
                    <Image src={image.url} />
                </ImageContainer>
                <Content>
                    <Title>{title.text}</Title>
                    <Section>
                        <SubTitle>Population Size</SubTitle>
                        <GraphContainer>
                            <GraphBar width={population_graph_percentage} />
                        </GraphContainer>
                        <Text>{population_size}</Text>
                    </Section>
                    <Section>
                        <SubTitle>Income Range</SubTitle>
                        <GraphContainer>
                            <GraphBar width={income_range_percentage} />
                        </GraphContainer>
                        <Text>{income_range}</Text>
                    </Section>
                    <Section hideMobile={true}>
                        <SubTitle>Key Platforms</SubTitle>
                        <Text>{key_platforms}</Text>
                    </Section>
                    <Section>
                        <ModalTrigger>+ more info</ModalTrigger>
                    </Section>
                </Content>
            </ThemeProvider>
        </Container>
    );
};

export default Worker;
