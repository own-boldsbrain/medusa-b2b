import LoginTemplate from "@modules/account/templates/login-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { NextPageWithLayout } from "types/global"

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Entrar" description="Faça login na sua conta ACME." />
      <LoginTemplate />
    </>
  )
}

Login.getLayout = (pagina) => {
  return <Layout>{pagina}</Layout>
}

export default Login
