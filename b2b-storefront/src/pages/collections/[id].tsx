import React from "react"
import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import { getCollectionIds } from "@lib/util/get-collection-ids"
import CollectionTemplate from "@modules/collections/templates"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import SkeletonCollectionPage from "@modules/skeletons/templates/skeleton-collection-page"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "../../types/global"

interface Parametros extends ParsedUrlQuery {
  id: string
}

const buscarColecao = async (id: string) => {
  return await medusaClient.collections.retrieve(id).then(({ collection }) => ({
    id: collection.id,
    title: collection.title,
  }))
}

export const buscarProdutosColecao = async ({
  pageParam = 0,
  id,
  cartId,
}: {
  pageParam?: number
  id: string
  cartId?: string
}) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    collection_id: [id],
    cart_id: cartId,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}

const PaginaColecao: NextPageWithLayout<PrefetchedPageProps> = ({
  notFound,
}) => {
  const { query, isFallback, replace } = useRouter()
  const id = typeof query.id === "string" ? query.id : ""

  const { data, isError, isSuccess, isLoading } = useQuery(
    ["obter_colecao", id],
    () => buscarColecao(id)
  )

  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return (
      <SkeletonCollectionPage>
        <div>Loading...</div> {/* Added children */}
      </SkeletonCollectionPage>
    )
  }

  if (isError) {
    replace("/404")
  }

  if (isFallback || isLoading || !data) {
    return (
      <SkeletonCollectionPage>
        <div>Loading...</div> {/* Added children */}
      </SkeletonCollectionPage>
    )
  }

  if (isSuccess) {
    return (
      <>
        <Head title={data.title} description={`Coleção ${data.title}`}>
          {/* Removed unnecessary children */}
        </Head>
        <CollectionTemplate collection={data}>
          {/* Removed unnecessary children */}
        </CollectionTemplate>
      </>
    )
  }

  return <></>
}

PaginaColecao.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout> {/* Added children */}
}

export const getStaticPaths: GetStaticPaths<Parametros> = async () => {
  const ids = await getCollectionIds()

  return {
    paths: ids.map((id) => ({ params: { id } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient()
  const id = context.params?.id as string

  await queryClient.prefetchQuery(["obter_colecao", id], () =>
    buscarColecao(id)
  )

  await queryClient.prefetchInfiniteQuery(
    ["obter_produtos_colecao", id],
    ({ pageParam }) => buscarProdutosColecao({ pageParam, id }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const queryData = await queryClient.getQueryData([`obter_colecao`, id])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      // Solução alternativa veja – https://github.com/TanStack/query/issues/1458#issuecomment-747716357
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      notFound: false,
    },
  }
}

export default PaginaColecao
