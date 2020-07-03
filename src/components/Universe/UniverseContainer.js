import React, { useEffect, useRef } from "react";
import { useArticle } from "../Platform/ArticleContext";
import Universe from "./Universe";

const UniverseContainer = ({ ...props }) => {
    const { map } = useArticle();
    const mapUpdater = useRef({ map: null });

    useEffect(() => {
        mapUpdater.current.map = map;
    }, [map]);
    return <Universe map={mapUpdater.current} />;
};

export default UniverseContainer;
