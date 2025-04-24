import { FieldValues, useForm } from "react-hook-form"
import { MEDUSA_BACKEND_URL, medusaClient } from "@lib/config"

import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import axios from "axios"
import { useAccount } from "@lib/context/account-context"
import { useCart } from "medusa-react"
import { useRouter } from "next/router"
import { useState } from "react"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
}

const Login = () => {
  const { refetchCustomer, is_b2b } = useAccount()
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const { cart, updateCart } = useCart()

  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password")
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInCredentials>()

  const onSubmit = handleSubmit(async (credentials) => {
    medusaClient.auth
      .authenticate(credentials)
      .then(async () => {
        refetchCustomer()
        if (process.env.NEXT_PUBLIC_SALES_CHANNEL_ID && cart?.sales_channel_id !== process.env.NEXT_PUBLIC_SALES_CHANNEL_ID) {
          const { data } = await axios.get(`${MEDUSA_BACKEND_URL}/store/customers/is-b2b`, {
            withCredentials: true
          })
          if (data.is_b2b) {
            updateCart.mutate({
              sales_channel_id: process.env.NEXT_PUBLIC_SALES_CHANNEL_ID
            })
          }
        }
        router.push(is_b2b ? "/wholesale/account" : "/account")
      })
      .catch(handleError)
  })

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">Bem-vindo de volta</h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        Faça login na sua conta de atacado
      </p>
      <form className="w-full" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          {/* Ajuste no uso do componente Input e Button para resolver problemas de compatibilidade */}
          <Input
            label="E-mail"
            {...register("email", { required: "O e-mail é obrigatório" })}
          />
          <Input
            label="Senha"
            {...register("password", { required: "A senha é obrigatória" })}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              Essas credenciais não correspondem aos nossos registros
            </span>
          </div>
        )}
        <Button
          className="mt-6"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </div>
  )
}

export default Login
