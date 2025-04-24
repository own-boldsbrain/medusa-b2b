import Head from "@modules/common/components/head"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const Inicio: NextPageWithLayout = () => {
  return (
    <>
      <Head
        title="Início"
        description="Compre todos os modelos disponíveis apenas na ACME. Envio mundial. Pagamento seguro."
      />
      <Hero />
      <FeaturedProducts />
    </>
  )
}

Inicio.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>
}

export default Inicio
