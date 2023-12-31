import { useContext } from 'react'
import { Flex, Button, Stack, Text } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from '../components/Form/Input'
import { AuthContext } from '../contexts/AuthContext'

export type RegisterFormData = {
  name: string
  email: string
  password: string
  isAdmin: boolean
  roleId: string
}

const registerFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
  isAdmin: yup.boolean().required('Campo obrigatório'),
  roleId: yup.string().uuid(),
})

export default function Register() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(registerFormSchema),
  })
  const { errors } = formState
  const { signIn } = useContext(AuthContext)

  const handleRegister: SubmitHandler<RegisterFormData> = async values => {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      isAdmin: values.isAdmin,
      roleId: values.roleId,
    }
    await signIn(data)
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleRegister)}
      >
        <Text
          fontSize={['2xl', '3xl']}
          p="8"
          fontWeight="bold"
          letterSpacing="tight"
          align="center"
        >
          Sign-In
        </Text>
        <Stack spacing="4">
          <Input
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
          <Input
            name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="blue"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}
