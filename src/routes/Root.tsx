import { Outlet } from "react-router-dom";
import { ChakraProvider, Container } from "@chakra-ui/react";

import theme from "../theme";

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Container>
          <Outlet />
          {/* <Heading>MPC TSS JS Demo</Heading>
          <Text>TODO</Text> */}
        </Container>
      </ChakraProvider>
    </>
  );
}

export default App;
