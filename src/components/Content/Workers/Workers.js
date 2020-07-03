import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useSection } from "../../Platform/SectionContext";
import { useFontObserver } from "../../Platform/FontObserver";
import { useResizer } from "../../Platform/Resizer";
import { workersColor } from "../../../config/colors";
import WorkerRow from "./WorkerRow";
import chunk from "lodash/chunk";
import Asteroid from "../../Decorations/Asteroid";
import { respond } from "../../../styles/responsive";

const Container = styled.div`
    ${respond(15, 40, "vh", "paddingTop")};
    ${respond(15, 40, "vh", "paddingBottom")};
    position: relative;
`;

const Workers = ({ data }) => {
    const { subSectionDispatch } = useSection();
    const fontLoaded = useFontObserver();
    const { area } = useResizer();
    const [, setBasePosition] = useState({});
    const ref = useRef();
    const previousPosition = useRef(null);
    useLayoutEffect(() => {
        const rect = ref.current.getBoundingClientRect();
        setBasePosition({
            top: window.scrollY + rect.top,
            left: window.scrollX + rect.left,
        });
        subSectionDispatch({
            payload: {
                title: "Workers",
                start: rect.top + window.scrollY,
                end: rect.bottom + window.scrollY,
                oldPosition: previousPosition.current,
            },
        });
        previousPosition.current = rect.top + window.scrollY;
    }, [ref, fontLoaded, area, previousPosition, subSectionDispatch]);
    const workers = chunk(data.data.profiles, 10);
    return (
        <Container ref={ref}>
            <Asteroid
                asteroid={2}
                width={"1.6%"}
                position={{ top: "120px", left: "50px" }}
                parallax={{ from: -100, to: 100 }}
            />
            <Asteroid
                asteroid={1}
                width={"3.89%"}
                position={{ top: "250px", right: "140px" }}
            />
            <Asteroid
                asteroid={0}
                width={"6.1%"}
                position={{ top: "30%", left: "25%" }}
            />
            <Asteroid
                asteroid={0}
                width={"4.4%"}
                transform={"rotate(-80deg)"}
                position={{
                    top: "60%",
                    right: "35%",
                }}
            />
            <Asteroid
                asteroid={1}
                width={"3.3%"}
                transform={"rotate(70deg)"}
                position={{
                    bottom: "100px",
                    left: "5%",
                }}
            />
            {workers.map((workers, i) => {
                return (
                    <WorkerRow
                        key={i}
                        workers={workers}
                        direction={i % 2 === 0 ? "toLeft" : "toRight"}
                        offset={i % 2 === 0 ? 0 : "100%"}
                    />
                );
            })}
        </Container>
    );
};

export default Workers;
