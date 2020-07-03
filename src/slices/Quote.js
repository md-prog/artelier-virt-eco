import React from "react";
import { useTheme } from "emotion-theming";
import CaseStudyQuote from "../components/Content/CaseStudyQuote";
import SmallQuote from "../components/Content/SmallQuote";
import LargeQuote from "../components/Content/LargeQuote";

const Quote = ({ data: { primary } }) => {
    const theme = useTheme();
    if (theme.type === "WhiteCaseStudy") {
        return <CaseStudyQuote data={primary} />;
    }
    if (theme.type === "SectionIntro") {
        if (primary.size === "Small") {
            return <SmallQuote data={primary} />;
        } else {
            return <LargeQuote data={primary} />;
        }
    }
    return <SmallQuote data={primary} />;
};
export default Quote;
