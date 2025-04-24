import LoginTemplate from "@modules/account/templates/login-template";
import Head from "next/head";
import Layout from "@modules/layout/templates";
import { NextPageWithLayout } from "types/global";

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Entrar</title>
        <meta name="description" content="Faça login na sua conta Oceano Solar." />
      </Head>
      <LoginTemplate />
    </>
  );
};

Login.getLayout = (pagina) => {
  return <Layout>{pagina}</Layout>;
};

export default Login;
