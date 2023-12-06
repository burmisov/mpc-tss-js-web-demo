import { useEffect } from "react";
import { Link as RrLink, useParams } from "react-router-dom";
import { Link as ChakraLink, Text } from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { setRecentRoom } from "../lib/recentRooms";
import RoomTitle from "../components/RoomTitle";
import { usePartyId } from "../lib/partyId";

function Room() {
  const { roomId } = useParams();
  if (!roomId) {
    throw new Error("No room ID");
  }

  const partyId = usePartyId();

  useEffect(() => {
    setRecentRoom(roomId);
  });

  return (
    <>
      <Text>
        <ChakraLink as={RrLink} to="/">
          <ArrowBackIcon />
          Home
        </ChakraLink>
      </Text>

      <RoomTitle roomId={roomId} />

      <p>Me: {partyId}</p>
    </>
  );
}

export default Room;
