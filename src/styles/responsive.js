export function respond(
    min,
    max,
    unit = "px",
    property = "fontSize",
    minWidth = 320,
    maxWidth = 1800,
    widthProperty = "vw",
    limitMax = true
) {
    let query = {
        [property]: `${min}${unit}`,
        [`@media screen and (min-width: ${minWidth}px)`]: {
            [property]: `calc(${min}${unit} + ${max -
                min} * ((100${widthProperty} - ${minWidth}px) / ${maxWidth -
                minWidth}))`,
        },
    };
    if (limitMax) {
        query[`@media screen and (min-width: ${maxWidth}px)`] = {
            [property]: `${max}${unit}`,
        };
    }
    return query;
}
export function invertedRespond(
    min,
    max,
    unit = "px",
    property = "fontSize",
    minWidth = 320,
    maxWidth = 1800,
    widthProperty = "vw",
    limitMax = true
) {
    let query = {
        [property]: `${max}${unit}`,
        [`@media screen and (min-width: ${minWidth}px)`]: {
            [property]: `calc(${min}${unit} + (${max - min}${unit} - ${max -
                min} * ((100${widthProperty} - ${minWidth}px) / ${maxWidth -
                minWidth})))`,
        },
    };
    if (limitMax) {
        query[`@media screen and (min-width: ${maxWidth}px)`] = {
            [property]: `${min}${unit}`,
        };
    }
    return query;
}

export function breakpoints(styles, property) {
    if (typeof styles !== "string") {
        return Object.keys(styles).reduce((acc, key, index) => {
            let style = styles[key];
            if (key !== "default") {
                acc[`@media screen and (min-width: ${key}px)`] = {
                    [property]: style,
                };
            } else {
                acc[property] = style;
            }
            return acc;
        }, {});
    } else {
        return { [property]: styles };
    }
}
