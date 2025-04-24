import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import { ReactElement } from "react";
import Layout from "@modules/layout/templates";
import ProductTemplate from "@modules/products/templates";
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page";
import { medusaClient } from "@lib/config";
import solarKits from '../../config/solar-kits.json';
import { ParsedUrlQuery } from "querystring";
import { Product } from "@medusajs/medusa";

interface SolarKit {
  nome: string;
  composicao: {
    video_url: string;
  }[];
}

interface PropriedadesPaginaPreRenderizada {
  naoEncontrado: boolean;
}

interface Parametros extends ParsedUrlQuery {
  handle: string;
}

const buscarProduto = async (handle: string): Promise<Product> => {
  return await medusaClient.products
    .list({ handle })
    .then(({ products }: { products: PricedProduct[] }) => products[0] as Product);
};

const PaginaProduto: NextPage<PropriedadesPaginaPreRenderizada> = ({ naoEncontrado }: { naoEncontrado: boolean }) => {
  const { query, isFallback, replace } = useRouter();
  const handle = typeof query.handle === "string" ? query.handle : "";

  const { data, isError, isLoading } = useQuery(
    [`obter_produto`, handle],
    () => buscarProduto(handle),
    {
      enabled: handle.length > 0,
      keepPreviousData: true,
    }
  );

  const [urlVideo, setUrlVideo] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const kit = (solarKits as SolarKit[]).find((kit) => kit.nome === data.title);
      if (kit) {
        setUrlVideo(kit.composicao[0]?.video_url || null);
      }
    }
  }, [data]);

  if (naoEncontrado) {
    if (typeof window !== "undefined") {
      replace("/404");
    }

    return (
      <SkeletonProductPage>
        {/* Adicione children se necessário */}
      </SkeletonProductPage>
    );
  }

  if (isFallback || isLoading || !data) {
    return <SkeletonProductPage />;
  }

  if (isError) {
    replace("/404");
  }

  return (
    <Layout>
      <ProductTemplate>
        {/* Adicione children se necessário */}
      </ProductTemplate>
      {urlVideo && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Vídeo do Produto</h2>
          <video controls className="w-full max-w-lg mt-4">
            <source src={urlVideo} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      )}
    </Layout>
  );
};

PaginaProduto.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>;
};

export const getStaticPaths: GetStaticPaths<Parametros> = async () => {
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

  await queryClient.prefetchQuery(["obter_produto", handle], () =>
    buscarProduto(handle)
  );

  const naoEncontrado = !(await queryClient.getQueryData(["obter_produto", handle]));

  return {
    props: {
      naoEncontrado,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default PaginaProduto;
