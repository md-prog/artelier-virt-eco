import React from "react";
import { useSidebar } from "../Platform/SidebarContext";
import DefinitionModal from "./DefinitionModal";
const DefinitionsContainer = ({ basePosition }) => {
    const { sidebarItems, setVisible } = useSidebar();
    return (
        <>
            {sidebarItems.map(item => {
                return (
                    <DefinitionModal
                        key={item.id}
                        id={item.id}
                        word={item.title}
                        content={item.content}
                        position={item.position}
                        atTop={item.atTop}
                        basePosition={basePosition}
                        visible={item.visible}
                        setVisible={setVisible}
                    />
                );
            })}
        </>
    );
};

export default DefinitionsContainer;
