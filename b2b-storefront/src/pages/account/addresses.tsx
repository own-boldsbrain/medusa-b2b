import AccountLayout from "@modules/account/templates/account-layout"
import AddressesTemplate from "@modules/account/templates/addresses-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const Enderecos: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Endereços" description="Visualize seus endereços" />
      <AddressesTemplate />
    </>
  )
}

Enderecos.getLayout = (pagina: ReactElement) => {
  return (
    <Layout>
      <AccountLayout>{pagina}</AccountLayout>
    </Layout>
  )
}

export default Enderecos
