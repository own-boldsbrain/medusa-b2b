import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import SkeletonOrderConfirmed from "@modules/skeletons/templates/skeleton-order-confirmed"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout } from "types/global"

const buscarPedido = async (id: string) => {
  return await medusaClient.orders.retrieve(id).then(({ order }) => order)
}

const Confirmado: NextPageWithLayout = () => {
  const router = useRouter()

  const id = typeof router.query?.id === "string" ? router.query.id : ""

  const { isSuccess, data, isLoading, isError } = useQuery(
    ["obter_pedido_confirmado", id],
    () => buscarPedido(id),
    {
      enabled: id.length > 0,
      staleTime: Infinity,
    }
  )

  if (isLoading) {
    return <SkeletonOrderConfirmed />
  }

  if (isError) {
    if (IS_BROWSER) {
      router.replace("/404")
    }

    return <SkeletonOrderConfirmed />
  }

  if (isSuccess) {
    return (
      <>
        <Head
          title="Pedido Confirmado"
          description="Sua compra foi realizada com sucesso"
        />

        <OrderCompletedTemplate order={data} />
      </>
    )
  }

  return <></>
}

Confirmado.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(["obter_pedido_confirmado", id], () =>
    buscarPedido(id)
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Confirmado
