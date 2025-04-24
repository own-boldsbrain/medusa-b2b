import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

const Register = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()

  const handleError = (e: Error) => {
    setAuthError("Ocorreu um erro. Por favor, tente novamente.")
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>()

  const onSubmit = handleSubmit(async (credentials) => {
    medusaClient.customers
      .create(credentials)
      .then(() => {
        refetchCustomer()
        router.push("/account")
      })
      .catch(handleError)
  })

  return (
    <div className="max-w-sm flex flex-col items-center mt-12">
      <h1 className="text-large-semi uppercase mb-6">Torne-se um Membro ACME</h1>
      <p className="text-center text-base-regular text-gray-700 mb-4">
        Crie seu perfil de Membro ACME e tenha acesso a uma experiência de compra aprimorada.
      </p>
      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nome"
            {...register("first_name", { required: "O nome é obrigatório" })}
            autoComplete="given-name"
            errors={errors}
          />
          <Input
            label="Sobrenome"
            {...register("last_name", { required: "O sobrenome é obrigatório" })}
            autoComplete="family-name"
            errors={errors}
          />
          <Input
            label="E-mail"
            {...register("email", { required: "O e-mail é obrigatório" })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Telefone"
            {...register("phone")}
            autoComplete="tel"
            errors={errors}
          />
          <Input
            label="Senha"
            {...register("password", {
              required: "A senha é obrigatória",
            })}
            type="password"
            autoComplete="new-password"
            errors={errors}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              Essas credenciais não correspondem aos nossos registros
            </span>
          </div>
        )}
        <span className="text-center text-gray-700 text-small-regular mt-6">
          Ao criar uma conta, você concorda com a{" "}
          <Link href="/content/privacy-policy">
            <a className="underline">Política de Privacidade</a>
          </Link>{" "}
          e os{" "}
          <Link href="/content/terms-of-use">
            <a className="underline">Termos de Uso</a>
          </Link>{" "}
          da ACME.
        </span>
        <Button className="mt-6">Cadastrar</Button>
      </form>
      <span className="text-center text-gray-700 text-small-regular mt-6">
        Já é membro?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Entrar
        </button>
        .
      </span>
    </div>
  )
}

export default Register
