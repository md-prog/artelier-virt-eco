import React from "react";
import loadable from "@loadable/component";
// import CryptoKittiesBubbles from "../components/DataViz/CryptoKittiesBubbles";
// import Counter from "../components/custom-components/Counter";
const AsyncComponent = loadable(props =>
    import(`../components/custom-components/${props.component}.js`)
);
const CustomComponent = ({ data: { primary, items } }) => {
    let props = items.reduce((acc, curr) => {
        if (curr.key1) {
            acc[curr.key1] = curr.value;
        }
        return acc;
    }, {});
    // return <CryptoKittiesBubbles />;
    // return <Counter component={primary.component} {...props} />;
    return <AsyncComponent component={primary.component} {...props} />;
};
export default CustomComponent;
