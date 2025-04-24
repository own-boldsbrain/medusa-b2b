import React from "react"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import LoginTemplate from "@modules/wholesale/templates/login-template"
import { NextPageWithLayout } from "types/global"

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        {/* Adicione children se necessário */}
      </Head>
      <LoginTemplate>
        {/* Adicione children se necessário */}
      </LoginTemplate>
    </>
  )
}

Login.getLayout = (pagina) => {
  return (
    <Layout>
      {pagina}
    </Layout>
  )
}

export default Login
