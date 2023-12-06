import {
  ChakraProvider,
  Container,
  Heading,
  theme,
  Text,
  Center,
} from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as { statusText: string; message: string };
  return (
    <>
      <ChakraProvider theme={theme}>
        <Container>
          <Center>
            <Heading>Oops!</Heading>
          </Center>
          <Center>
            <Text>Sorry, an unexpected error has occurred:</Text>
          </Center>
          <Center>
            <Text>
              <i>{error.statusText || error.message}</i>
            </Text>
          </Center>
        </Container>
      </ChakraProvider>
    </>
  );
}
