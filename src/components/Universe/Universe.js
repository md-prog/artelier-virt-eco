import styled from "@emotion/styled";
import React, { useEffect, useRef, memo } from "react";
import WebGL from "./webgl/webgl";
import { isBrowser } from "@emotion/core/src/utils";

const CanvasContainer = styled.div`
    canvas {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
`;

const UniverseContainer = ({ map, ...props }) => {
    const container = useRef();
    let webgl = isBrowser ? WebGL() : null;
    useEffect(() => {
        if (webgl) {
            webgl.setMap(map);
        }
    }, [map, webgl]);

    useEffect(() => {
        if (webgl) {
            webgl.attach(container);
        }
    }, [webgl]);

    return <CanvasContainer ref={container} />;
};

export default memo(UniverseContainer);
