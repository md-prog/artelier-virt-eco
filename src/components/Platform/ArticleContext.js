import React, {
    useContext,
    createContext,
    useState,
    useEffect,
    useReducer,
    useCallback,
} from "react";

const ArticleContext = createContext();

export const { Provider, Consumer } = ArticleContext;

export function useArticle() {
    const context = useContext(ArticleContext);

    if (!context) {
        throw new Error(`useArticle must be used within an ArticleProvider`);
    }

    return context;
}

function sectionsReducer(
    state,
    { type, payload: { index, start, end, points, title, subSections } }
) {
    let dupe = [...state];
    dupe[index] = { index, start, end, points, title, subSections };
    return dupe;
}

const ArticleProvider = props => {
    const [sections, sectionsDispatch] = useReducer(sectionsReducer, []);
    const [map, setMap] = useState([]);

    const setSection = useCallback(
        (index, start, end, height, points, title, subSections) => {
            sectionsDispatch({
                payload: {
                    index,
                    start,
                    end,
                    height,
                    points,
                    title,
                    subSections,
                },
            });
        },
        []
    );

    useEffect(() => {
        let tmpMap = [];
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionStart = section.start;
            const sectionEnd = section.end;
            tmpMap[i] = {
                index: section.index,
                title: section.title,
                sectionStart,
                sectionEnd,
                pois: [],
                sections: [],
            };
            for (let k = 0; k < section.subSections.length; k++) {
                let subSection = section.subSections[k];
                let subSectionStart = subSection.start;
                let subSectionEnd = subSection.end;
                tmpMap[i].sections[k] = {
                    start: subSectionStart,
                    end: subSectionEnd,
                    title: subSection.title,
                    white: subSection.white,
                    label: subSection.label,
                };
            }
            for (let j = 0; j < section.points.length; j++) {
                let subSection = section.points[j];
                let subSectionStart =
                    j === 0 ? section.start : section.points[j - 1].position;
                let subSectionEnd = subSection.position;
                tmpMap[i].pois[j] = {
                    start: subSectionStart,
                    end: subSectionEnd,
                    position: subSection.position,
                    label: subSection.label,
                };
            }
            const finalSubSectionStart =
                section.points.length > 0
                    ? tmpMap[i].pois[tmpMap[i].pois.length - 1].end
                    : sectionStart;
            const finalSubSectionEnd = sectionEnd;
            tmpMap[i].pois.push({
                start: finalSubSectionStart,
                end: finalSubSectionEnd,
                label: "__remainder",
                position: finalSubSectionEnd,
            });
        }
        setMap(tmpMap);
    }, [sections]);

    return <Provider value={{ setSection, sections, map }} {...props} />;
};

export default ArticleProvider;
