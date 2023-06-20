import { useContext, useEffect } from 'react'
import { Box, Flex, SimpleGrid, Text, Stack, Button } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { AuthContext, signOut } from '../contexts/AuthContext'
import { api } from '../services/apiClient'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../components/Form/Input'
import Router from 'next/router'
import { toast } from 'react-toastify'

import * as yup from 'yup'

interface IChangeUserInformation {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const changeUserInformation = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  old_password: yup.string(),
  password: yup.string().optional(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Senhas devem ser idênticas')
    .when('password', {
      is: true,
      then: yup
        .string()
        .required('Campo de confirmação de senha é obrigatório'),
    }),
})

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(changeUserInformation),
  })
  const { errors, isLoading } = formState

  async function handleUserForm({
    email,
    password,
    name,
    old_password,
    password_confirmation,
  }: IChangeUserInformation) {
    try {
      toast.success('Informações alteradas com sucesso!')
      Router.push('/dashboard')
      return api.put('/users/profile', {
        email,
        password,
        name,
        old_password,
        password_confirmation,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleUserInformation: SubmitHandler<any> = async values => {
    const data = {
      name: values.name,
      email: values.email,
      old_password: values.old_password,
      password: values.password,
      password_confirmation: values.password_confirmation,
    }
    await handleUserForm(data)
  }

  useEffect(() => {
    api
      .get('/users/profile')
      .then(response => console.log(response))
      .catch(() => {
        signOut()
      })
  }, [])

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <SimpleGrid flex="1" gap="4" minChildWidth="320px">
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="450">
            <Flex
              flexDir="column"
              as="form"
              onSubmit={handleSubmit(handleUserInformation)}
            >
              <Text
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                mb="4"
              >
                Informações do usuário {user?.name}!
              </Text>

              <Stack spacing="4">
                <Input
                  name="name"
                  type="text"
                  label="Nome"
                  error={errors.name}
                  {...register('name')}
                />
                <Input
                  name="email"
                  type="text"
                  label="Email"
                  error={errors.email}
                  {...register('email')}
                />
                <Input
                  name="old_password"
                  type="password"
                  label="Senha antiga"
                  error={errors.old_password}
                  {...register('old_password')}
                />
                <Input
                  name="password"
                  type="password"
                  label="Senha"
                  error={errors.password}
                  {...register('password')}
                />
                <Input
                  name="password_confirmation"
                  type="password"
                  label="Confirmar Senha"
                  error={errors.password_confirmation}
                  {...register('password_confirmation')}
                />
              </Stack>

              <Button
                type="submit"
                mt="6"
                colorScheme="blue"
                w="150px"
                isLoading={isLoading}
              >
                Mudar
              </Button>
            </Flex>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
