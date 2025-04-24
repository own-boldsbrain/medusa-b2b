import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import SkeletonOrderConfirmed from "@modules/skeletons/templates/skeleton-order-confirmed"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout } from "types/global"
import React from "react";

const buscarPedido = async (id: string) => {
  return await medusaClient.orders.retrieve(id).then(({ order }) => order)
}

const Confirmado: NextPageWithLayout = () => {
  const router = useRouter();

  const id = typeof router.query?.id === "string" ? router.query.id : "";

  const { isSuccess, data, isLoading, isError } = useQuery(
    ["obter_detalhes_pedido", id],
    () => buscarPedido(id),
    {
      enabled: id.length > 0,
      staleTime: 60 * 60 * 1000, // 1 hora
    }
  );

  if (isLoading) {
    return <SkeletonOrderConfirmed />;
  }

  if (isError) {
    if (IS_BROWSER) {
      router.replace("/404");
    }

    return <SkeletonOrderConfirmed />;
  }

  if (isSuccess) {
    return (
      <>
        <Head
          title={`Pedido #${data.display_id}`}
          description="Visualize seu pedido"
        />

        <OrderDetailsTemplate order={data} />
      </>
    );
  }

  return <></>;
};

Confirmado.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>;
};

export default Confirmado;
