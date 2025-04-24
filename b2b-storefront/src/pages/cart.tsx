import Head from "@modules/common/components/head";
import CartTemplate from "@modules/cart/templates";
import Layout from "@modules/layout/templates";
import { ReactElement } from "react";
import { NextPageWithLayout } from "types/global";

const Carrinho: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Sacola de Compras" description="Veja sua sacola de compras na Oceano Solar Shopping." />
      <CartTemplate />
    </>
  );
};

Carrinho.getLayout = (pagina: ReactElement) => {
  return <Layout>{pagina}</Layout>;
};

export default Carrinho;
