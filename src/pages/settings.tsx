import { useContext, useEffect, useState } from 'react'
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { AuthContext, signOut } from '../contexts/AuthContext'
import { api } from '../services/apiClient'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const handleClick = () => setShowPassword(!showPassword)

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
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4" h="300">
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              mb="4"
            >
              Informações do usuário {user?.name}!
            </Text>

            <Text>Senha</Text>
            <InputGroup size="md">
              <Input pr="4.5rem" type={showPassword ? 'text' : 'password'} />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
