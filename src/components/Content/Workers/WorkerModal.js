import { ThemeProvider } from "emotion-theming";
import { Border, Corner } from "./border";
import React from "react";
import styled from "@emotion/styled";
import { respond } from "../../../styles/responsive";

const ModalContainer = styled.div`
    position: relative;
    background-color: rgba(0, 0, 0, 0.9);
    font-family: Pixelar, sans-serif;
    max-width: 537px;
    width: calc(100vw - 24px);
    padding: 24px;
    margin-top: 12px;
    margin-bottom: 12px;
    @media screen and (min-width: 1080px) {
        width: calc(100vw - 80px);
        max-width: 1080px;
    }
`;
const Title = styled.h3`
    text-transform: uppercase;
    ${respond(40, 60)};
    padding: 0 15px;
    text-align: center;
    margin-bottom: 30px;
    line-height: 0.65;
    color: ${({ theme }) => theme.color};
`;
const Content = styled.div`
    display: grid;
    grid-template-areas: "image column1" "column2 column2";
    grid-template-rows: auto auto;
    height: 100%;
    overflow: visible;
    @media screen and (min-width: 1080px) {
        display: flex;
        flex: 1;
        padding-left: 190px;
        height: auto;
    }
`;
const Column1 = styled.div`
    display: flex;
    flex-direction: column;
    //padding-right: 45px;
    @media screen and (min-width: 1080px) {
        //padding-bottom: 45px;
        //padding-right: 0;
        width: 160px;
    }
    grid-area: column1;
`;
const Column2 = styled.div`
    flex: 1;
    //padding: 0 66px 45px 66px;
    flex-direction: column;
    //justify-content: space-between;
    display: flex;
    grid-area: column2;
    margin-top: 20px;
    @media screen and (min-width: 1080px) {
        margin-top: 0;
        margin-left: 35px;
    }
`;
const ImageContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    grid-area: image;
    @media screen and (min-width: 1080px) {
        position: absolute;
        width: 230px;
        top: 0;
        left: 0;
        bottom: 0;
    }
`;
const Image = styled.img`
    //height: 60%;
    width: 50%;
    height: auto;
    margin-right: 24px;
    @media screen and (min-width: 1080px) {
        max-height: 45%;
    }
`;

const SubTitle = styled.h3`
    font-size: 22px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.color};
`;
const Text = styled.div`
    font-size: 21px;
`;
const Section = styled.div`
    margin-bottom: 20px;
`;
const GraphContainer = styled.div`
    height: 14px;
    width: 70%;
    border: 1px solid ${({ theme }) => theme.color};
    padding: 2px;
    margin-bottom: 10px;
    display: none;
    @media screen and (min-width: 1080px) {
        display: block;
    }
`;
const GraphBar = styled.div`
    height: 100%;
    width: ${({ width }) => width}%;
    background-color: ${({ theme }) => theme.color};
`;

const CloseButton = styled.button`
    appearance: none;
    background: none;
    border: 0;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 0;
    cursor: pointer;
    svg {
        width: 20px;
        height: 20px;
    }
    path {
        transition: stroke 0.3s;
        stroke: ${({ theme }) => theme.color};
    }
    &:hover {
        path {
            stroke: white;
        }
    }
`;

const WorkerModal = ({ content, hideModal }) => {
    const {
        color,
        description,
        image,
        income_range,
        income_range_percentage,
        income_streams,
        key_platforms,
        population_graph_percentage,
        population_size,
        title,
        types_of_employment,
    } = content;
    return (
        <ModalContainer>
            <ThemeProvider theme={{ color: color }}>
                <Corner top={true} left={true} />
                <Corner top={true} left={false} />
                <Corner top={false} left={true} />
                <Corner top={false} left={false} />
                <Border position={"top"} />
                <Border position={"left"} />
                <Border position={"bottom"} />
                <Border position={"right"} />
                <CloseButton onClick={hideModal}>
                    <svg
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1.25 1L17.25 17" strokeWidth="2" />
                        <path d="M17.25 1L1.25 17" strokeWidth="2" />
                    </svg>
                </CloseButton>
                <Title>{title.text}</Title>

                <Content>
                    <ImageContainer>
                        <Image
                            src={image.url}
                            width={image.dimensions.width}
                            height={image.dimensions.height}
                        />
                    </ImageContainer>
                    <Column1>
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
                        <Section>
                            <SubTitle>Key Platforms</SubTitle>
                            <Text>{key_platforms}</Text>
                        </Section>
                    </Column1>
                    <Column2>
                        <Section>
                            <SubTitle>Type of employment</SubTitle>
                            <Text>{types_of_employment}</Text>
                        </Section>
                        <Section>
                            <SubTitle>Income Streams</SubTitle>
                            <Text>{income_streams}</Text>
                        </Section>
                        <Section>
                            <SubTitle>Description</SubTitle>
                            <Text
                                dangerouslySetInnerHTML={{
                                    __html: description.html,
                                }}
                            />
                        </Section>
                    </Column2>
                </Content>
            </ThemeProvider>
        </ModalContainer>
    );
};
export default WorkerModal;
