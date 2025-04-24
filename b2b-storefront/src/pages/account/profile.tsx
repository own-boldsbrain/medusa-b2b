import AccountLayout from "@modules/account/templates/account-layout"
import ProfileTemplate from "@modules/account/templates/profile-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

const Perfil: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Perfil" description="Visualize e edite seu perfil ACME." />
      <ProfileTemplate />
    </>
  )
}

Perfil.getLayout = (pagina: ReactElement) => {
  return (
    <Layout>
      <AccountLayout>{pagina}</AccountLayout>
    </Layout>
  )
}

export default Perfil
