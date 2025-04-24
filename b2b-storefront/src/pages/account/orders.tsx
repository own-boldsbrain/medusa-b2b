import AccountLayout from "@modules/account/templates/account-layout"
import OrdersTemplate from "@modules/account/templates/orders-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { NextPageWithLayout } from "types/global"

const Pedidos: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Pedidos" description="Visão geral dos seus pedidos anteriores." />
      <OrdersTemplate />
    </>
  )
}

Pedidos.getLayout = (pagina) => {
  return (
    <Layout>
      <AccountLayout>{pagina}</AccountLayout>
    </Layout>
  )
}

export default Pedidos
