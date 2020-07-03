import React from "react";
import parse, { domToReact } from "html-react-parser";
import Definition from "../Definitions/Definition";

const RichText = ({ html, ...props }) => {
    const options = {
        replace: ({ attribs, children }) => {
            if (attribs && attribs["data-definition"]) {
                let def = attribs["data-definition"];
                return (
                    <Definition
                        word={domToReact(children, options)}
                        definition={def}
                    />
                );
            }
        },
    };
    return parse(html, options);
};

export default RichText;
