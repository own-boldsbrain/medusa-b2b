import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import LoginTemplate from "@modules/wholesale/templates/login-template"
import { NextPageWithLayout } from "types/global"

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Entrar" description="Faça login no Oceano." />
      <LoginTemplate />
    </>
  )
}

Login.getLayout = (pagina) => {
  return <Layout>{pagina}</Layout>
}

export default Login
