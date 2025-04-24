import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, region }) => {
  const regionKeywords = {
    GD: "photovoltaic solar GD Brazil, distributed generation solar",
    GC: "photovoltaic solar GC Brazil, centralized generation solar",
    Meli: "photovoltaic solar Meli Brazil, solar energy marketplace",
  };

  const keywords = region ? regionKeywords[region] : "photovoltaic solar Brazil";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

export default SEO;
