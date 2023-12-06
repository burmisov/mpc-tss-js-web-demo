import { Link } from "react-router-dom";
import { Heading } from "@chakra-ui/react";

function Home() {
  return (
    <>
      <Heading>MPC TSS JS Demo</Heading>
      <p>
        <Link to={"/room/123"}>Go to Room 123</Link>
      </p>
    </>
  );
}

export default Home;
