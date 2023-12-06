import { ChakraProvider, Container, Heading, Text } from "@chakra-ui/react";

import theme from "./theme";

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Container>
          <Heading>MPC TSS JS Demo</Heading>
          <Text>TODO</Text>
        </Container>
      </ChakraProvider>
    </>
  );
}

export default App;
