import React from "react";
import { NextSeo } from "next-seo";
import seoConfig from "../../../config/seo-config.json";

type Region = "GD" | "GC" | "Meli";

interface HeadProps {
  title: string;
  description?: string;
  region?: Region;
}

const Head: React.FC<HeadProps> = ({ title, description, region }) => {
  const regionConfig = region ? seoConfig.regions[region] : seoConfig.default;

  return (
    <NextSeo
      title={title}
      description={description || regionConfig.description}
      additionalMetaTags={[
        {
          name: "keywords",
          content: regionConfig.keywords,
        },
      ]}
    />
  );
};

export default Head;
