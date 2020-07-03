/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import Ticker from "../../Ticker";
import Worker from "./Worker";
import Modal from "react-modal";
import { usePageVisibility } from "react-page-visibility";
import { useResizer } from "../../Platform/Resizer";
import { relativeProgress } from "../../Universe/webgl/math";
Modal.setAppElement("#___gatsby");
const Container = styled.div`
    width: 100%;
    overflow: hidden;
`;

const WorkerRow = ({ workers, ...props }) => {
    const [moving, setMoving] = useState(true);
    const [modalContent, setModalContent] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const { area } = useResizer();
    const isVisible = usePageVisibility();
    const showModal = useCallback(
        content => {
            setModalContent(content);
            setModalVisible(true);
        },
        [setModalContent]
    );
    const hideModal = useCallback(() => {
        setModalVisible(false);
    }, [setModalVisible]);
    const speed = 5 + relativeProgress(area.width, 375, 1800) * 10;
    return (
        <>
            <Modal
                isOpen={modalVisible}
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
                        // top: "50%",
                        // left: "50%",
                        // right: null,
                        // bottom: null,
                        // transform: "translate(-50%, -50%)",
                        border: 0,
                        background: null,
                        overflow: "visible",
                        padding: 0,
                        top: null,
                        left: null,
                        right: null,
                        bottom: null,
                    },
                }}
            >
                {modalContent}
            </Modal>
            <Container
                onMouseEnter={() => {
                    setMoving(false);
                }}
                onMouseLeave={() => {
                    setMoving(true);
                }}
            >
                <Ticker
                    speed={speed ? speed : 0}
                    {...props}
                    move={moving && !modalVisible && isVisible && !!speed}
                >
                    {({ index }) => {
                        let _index = index % workers.length;
                        return (
                            <Worker
                                content={workers[_index]}
                                showModal={showModal}
                                hideModal={hideModal}
                                modalVisible={modalVisible}
                            />
                        );
                    }}
                </Ticker>
            </Container>
        </>
    );
};

export default WorkerRow;
