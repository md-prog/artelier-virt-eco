import React, { useEffect } from "react";
import Introduction from "../Sections/Introduction";
import TheMarketplace from "../Sections/TheMarketplace";
import ThePopulation from "../Sections/ThePopulation";
import TheWorkers from "../Sections/TheWorkers";
import TheUnderground from "../Sections/TheUnderground";
import ThePioneers from "../Sections/ThePioneers";
import SectionProvider from "./SectionContext";
import { graphql } from "gatsby";
import SidebarProvider from "./SidebarContext";
import useResizeObserver from "use-resize-observer/polyfilled";
import { useResizer } from "./Resizer";
import debounce from "lodash/debounce";
import Credits from "../Sections/Credits";
const Article = ({ ...props }) => {
    const { ref, width, height } = useResizeObserver();

    const { setArea } = useResizer();
    useEffect(() => {
        setArea({ width, height });
    }, [width, height, setArea]);
    return (
        <SidebarProvider>
            <div ref={ref}>
                <SectionProvider>
                    <Introduction />
                </SectionProvider>
                <SectionProvider>
                    <TheMarketplace />
                </SectionProvider>
                <SectionProvider>
                    <ThePopulation />
                </SectionProvider>
                <SectionProvider>
                    <TheWorkers />
                </SectionProvider>
                <SectionProvider>
                    <TheUnderground />
                </SectionProvider>
                <SectionProvider>
                    <ThePioneers />
                </SectionProvider>
                <SectionProvider>
                    <Credits />
                </SectionProvider>
            </div>
        </SidebarProvider>
    );
};

export default Article;

export const sectionQuery = graphql`
    fragment SectionContent on PrismicSection {
        data {
            body {
                __typename
                ... on PrismicSectionBodyText {
                    id
                    primary {
                        text {
                            html
                        }
                    }
                }
                ... on PrismicSectionBodyPullQuote {
                    id
                    primary {
                        content {
                            html
                        }
                        size
                    }
                }
                ... on PrismicSectionBodyImage {
                    id
                    primary {
                        caption {
                            html
                        }
                        image {
                            fluid {
                                ...GatsbyPrismicImageFluid
                            }
                        }
                    }
                }
                ... on PrismicSectionBodyEmptyspace {
                    id
                    primary {
                        label
                        height
                    }
                }
                ... on PrismicSectionBodyCustomComponent {
                    id
                    primary {
                        component
                    }
                    items {
                        key1
                        value
                    }
                }
                ... on PrismicSectionBodyImageGraph {
                    id
                    primary {
                        graph_date_range
                        graph_subtitle
                        graph_title
                        source
                        graph {
                            url
                            dimensions {
                                height
                                width
                            }
                            thumbnails {
                                Mobile {
                                    url
                                    dimensions {
                                        height
                                        width
                                    }
                                }
                            }
                        }
                    }
                }
                ... on PrismicSectionBodyBigNumbers {
                    id
                    primary {
                        title1 {
                            text
                        }
                        source
                    }
                    items {
                        number
                        label
                    }
                }
                ... on PrismicSectionBodyBigStats {
                    id
                    items {
                        label
                        value
                    }
                    primary {
                        sub_text
                        title1 {
                            text
                        }
                    }
                }
                ... on PrismicSectionBodyCardswithmodal {
                    id
                    primary {
                        content_1 {
                            html
                        }
                        content_2 {
                            html
                        }
                        summary_1
                        summary_2
                        title_1 {
                            text
                        }
                        title_2 {
                            text
                        }
                    }
                }
                ... on PrismicSectionBodyImageDataVisualization {
                    id
                    primary {
                        image {
                            thumbnails {
                                Mobile {
                                    url
                                }
                            }
                            url
                        }
                    }
                }
            }
            key
            display_title {
                text
            }
            sub_title {
                text
            }
        }
    }
`;
