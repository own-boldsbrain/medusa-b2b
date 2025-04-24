import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import Link from "next/link"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const NaoEncontrado: NextPageWithLayout = () => {
  return (
    <>
      <Head title="404" description="Algo deu errado" />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl-semi text-gry-900">Página não encontrada</h1>
        <p className="text-small-regular text-gray-700">
          A página que você tentou acessar não existe.
        </p>
        <Link href="/">
          <a className="mt-4 underline text-base-regular text-gray-900">
            Ir para a página inicial
          </a>
        </Link>
      </div>
    </>
  )
}

NaoEncontrado.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>
}

export default NaoEncontrado
