import CheckoutTemplate from "@modules/checkout/templates"
import Head from "@modules/common/components/head"

const Checkout = () => {
  return (
    <>
      <Head title="Finalizar Compra" />
      <CheckoutTemplate />
    </>
  )
}

export default Checkout
