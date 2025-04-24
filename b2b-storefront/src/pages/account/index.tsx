import AccountLayout from "@modules/account/templates/account-layout"
import OverviewTemplate from "@modules/account/templates/overview-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const Conta: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Conta" description="Visão geral da atividade da sua conta." />
      <OverviewTemplate />
    </>
  )
}

Conta.getLayout = (pagina: ReactElement) => {
  return (
    <Layout>
      <AccountLayout>{pagina}</AccountLayout>
    </Layout>
  )
}

export default Conta
