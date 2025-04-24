import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import { ReactElement } from "react";
import Layout from "@modules/layout/templates";
import ProductTemplate from "@modules/products/templates";
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page";
import { medusaClient } from "@lib/config";
import solarKits from "@config/solar-kits.json";
import { ParsedUrlQuery } from "querystring";
import { Product } from "@medusajs/medusa";

interface SolarKit {
  name: string;
  composition: {
    video_url: string;
  }[];
}

interface PrefetchedPageProps {
  notFound: boolean;
}

interface Params extends ParsedUrlQuery {
  handle: string;
}

const fetchProduct = async (handle: string): Promise<Product> => {
  return await medusaClient.products
    .list({ handle })
    .then(({ products }: { products: Product[] }) => products[0]);
};

const ProductPage: NextPage<PrefetchedPageProps> = ({ notFound }) => {
  const { query, isFallback, replace } = useRouter();
  const handle = typeof query.handle === "string" ? query.handle : "";

  const { data, isError, isLoading } = useQuery(
    [`get_product`, handle],
    () => fetchProduct(handle),
    {
      enabled: handle.length > 0,
      keepPreviousData: true,
    }
  );

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const kit = (solarKits as SolarKit[]).find((kit) => kit.name === data.title);
      if (kit) {
        setVideoUrl(kit.composition[0]?.video_url || null);
      }
    }
  }, [data]);

  if (notFound) {
    if (typeof window !== "undefined") {
      replace("/404");
    }

    return <SkeletonProductPage />;
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonProductPage />;
  }

  if (isError) {
    replace("/404");
  }

  return (
    <Layout>
      <ProductTemplate product={data} />
      {videoUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Vídeo do Produto</h2>
          <video controls className="w-full max-w-lg mt-4">
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      )}
    </Layout>
  );
};

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await medusaClient.products.list().then(({ products }) =>
    products.map((product) => product.handle)
  );

  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  const handle = context.params?.handle as string;

  await queryClient.prefetchQuery(["get_product", handle], () =>
    fetchProduct(handle)
  );

  const notFound = !(await queryClient.getQueryData(["get_product", handle]));

  return {
    props: {
      notFound,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default ProductPage;
