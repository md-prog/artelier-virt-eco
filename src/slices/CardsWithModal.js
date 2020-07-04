import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import gridSizing from "../styles/gridSizing";
import { breakpoints, respond } from "../styles/responsive";
import Text from "./Text";
import Modal from "react-modal";
const Container = styled.div`
    ${({ theme }) => breakpoints(theme.position.cards, "gridColumn")};
    display: grid;
    grid-template-columns: 1fr;

    ${gridSizing(1, ["gridColumnGap"])};
    ${gridSizing(2, ["paddingTop", "paddingBottom"])};
    @media screen and (min-width: 1100px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto 1fr;
    }
`;
const CardContent = styled.div`
    @media screen and (min-width: 1100px) {
        grid-row: 1;
    }
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    padding: 56px 37px 23px;
`;
const Title = styled.h2`
    font-family: Plaak, sans-serif;
    ${respond(35, 45)};
    letter-spacing: 0.02em;
    font-weight: bold;
    margin-bottom: 19px;
`;
const Content = styled.div`
    ${respond(16, 20)};
    line-height: 1.5;
`;

const CardButton = styled.div`
    ${gridSizing(2, ["marginBottom"])};
    @media screen and (min-width: 1100px) {
        grid-row: 2;
        margin-bottom: 0;
    }
    &:last-of-type {
        margin: 0;
    }
    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    padding: 0 37px 56px;
`;
const Button = styled.button`
    background: none;
    border: 2px solid white;
    color: white;
    padding: 19px;
    ${respond(14, 18)};
    text-transform: uppercase;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: left;
    width: 100%;
    position: relative;
    cursor: pointer;
    transition: opacity 0.3s;
    &:hover {
        opacity: 0.8;
    }
    svg {
        position: absolute;
        right: 19px;
        top: 50%;
        transform: translateY(-50%);
    }
`;
const ModalCloseContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    background-color: ${({ theme }) =>
        theme.mobileBackgroundColor
            ? theme.mobileBackgroundColor
            : theme.backgroundColor};
    @media screen and (min-width: 800px) {
        background-color: ${({ theme }) => theme.backgroundColor};
    }
    ${gridSizing(2, ["paddingBottom"])};

    @media screen and (min-width: 800px) {
        display: none;
    }
`;
const ModalCloseButton = styled(Button)`
    width: auto;
    text-align: center;
    grid-column: 1 / -1;
    padding-left: 40px;
    padding-right: 40px;
`;

const ReadMoreContainer = styled.div`
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(48, 1fr);
    ${gridSizing(2, ["paddingTop", "paddingBottom"])};
    max-width: 1800px;
    width: 100%;
`;
const ReadMoreInner = styled.div`
    ${({ theme }) => breakpoints(theme.position.content, "gridColumn")};
    border: 3px solid white;
    position: relative;
    pointer-events: auto;
`;
const CloseButton = styled.button`
    position: absolute;
    ${gridSizing(0.5, ["top", "right"])};
    appearance: none;
    background: none;
    border: 0;
    ${respond(35, 45, "px", "height")};
    ${respond(35, 45, "px", "width")};
    padding: 0;
    cursor: pointer;
    transition: opacity 0.3s;
    &:hover {
        opacity: 0.8;
    }
    svg {
        height: 100%;
        width: 100%;
    }
`;
const Card = ({ title, intro, modalContent }) => {
    const [showReadMore, setShowReadMore] = useState(false);
    const hideModal = useCallback(() => {
        setShowReadMore(false);
    }, [setShowReadMore]);
    return (
        <>
            <CardContent>
                <Title>{title}</Title>
                <Content>{intro}</Content>
            </CardContent>
            <CardButton>
                <Button
                    onClick={() => {
                        setShowReadMore(true);
                    }}
                >
                    Read more{" "}
                    <svg
                        width="14"
                        height="15"
                        viewBox="0 0 14 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 8.37488V6.37488H14V8.37488H0Z"
                            fill="white"
                        />
                        <path
                            d="M6 0.374878L8 0.374878L8 14.3749L6 14.3749L6 0.374878Z"
                            fill="white"
                        />
                    </svg>
                </Button>
            </CardButton>
            <Modal
                isOpen={showReadMore}
                onRequestClose={hideModal}
                style={{
                    overlay: {
                        zIndex: 30,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        overflowY: "auto",
                        display: "flex",
                    },
                    content: {
                        position: "static",
                        margin: "auto",
                        border: 0,
                        background: null,
                        overflow: "visible",
                        padding: 0,
                        top: null,
                        left: null,
                        right: null,
                        bottom: null,
                        pointerEvents: "none",
                    },
                }}
            >
                <ReadMoreContainer>
                    <ReadMoreInner>
                        <CloseButton onClick={hideModal}>
                            <svg
                                width="64"
                                height="65"
                                viewBox="0 0 64 65"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.1834 50.6331L13.6377 46.0874L45.4575 14.2676L50.0032 18.8133L18.1834 50.6331Z"
                                    fill="white"
                                />
                                <path
                                    d="M13.6369 18.8128L18.1826 14.2671L50.0024 46.0869L45.4567 50.6326L13.6369 18.8128Z"
                                    fill="white"
                                />
                            </svg>
                        </CloseButton>
                        <Text
                            data={{
                                primary: {
                                    text: modalContent,
                                },
                            }}
                        />
                        <ModalCloseContainer>
                            <ModalCloseButton
                                onClick={() => {
                                    setShowReadMore(false);
                                }}
                            >
                                Close{" "}
                            </ModalCloseButton>
                        </ModalCloseContainer>
                    </ReadMoreInner>
                </ReadMoreContainer>
            </Modal>
        </>
    );
};
const CardsWithModal = ({ data }) => {
    const {
        title_1,
        summary_1,
        content_1,
        title_2,
        summary_2,
        content_2,
    } = data.primary;
    return (
        <Container>
            <Card
                title={title_1.text}
                intro={summary_1}
                modalContent={content_1}
            />
            <Card
                title={title_2.text}
                intro={summary_2}
                modalContent={content_2}
            />
        </Container>
    );
};

export default CardsWithModal;
