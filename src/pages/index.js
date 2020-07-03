import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Article from "../components/Platform/Article";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Footer from "../components/Footer/Footer";
import ArticleProvider from "../components/Platform/ArticleContext";
import NavigationHandler from "../components/Navigation/NavigationHandler";
import UniverseContainer from "../components/Universe/UniverseContainer";
import ProgressBarProvider from "../components/ProgressBar/ProgressBarProvider";
const VirtualEconomy = ({ data }) => {
    return (
        <ArticleProvider>
            <ProgressBarProvider>
                <NavigationHandler />
                <UniverseContainer />
                <Layout>
                    <SEO title="The Virtual Economy" />
                    <Article />
                    <Footer />
                    <ProgressBar />
                </Layout>
            </ProgressBarProvider>
        </ArticleProvider>
    );
};

export default VirtualEconomy;
