import { Heading } from "@chakra-ui/react";

import PartyId from "../components/PartyId";
import NewRoom from "../components/NewRoom";
import RecentRooms from "../components/RecentRooms";
import ToKnownRoom from "../components/ToKnownRoom";

function Home() {
  return (
    <>
      <Heading mt="5">MPC TSS JS Demo</Heading>
      <PartyId />
      <RecentRooms />
      <NewRoom />
      <ToKnownRoom />
    </>
  );
}

export default Home;
