import { useEffect, useState } from "react";
import { Link as RrLink, useParams } from "react-router-dom";
import { Link as ChakraLink, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import { setRecentRoom } from "../lib/recentRooms";
import RoomTitle from "../components/RoomTitle";
import { usePartyId } from "../lib/partyId";
import { P2PConnection } from "../lib/p2p";
import PeerParties from "../components/PeerParties";

function Room() {
  const { roomId } = useParams();
  if (!roomId) {
    throw new Error("No room ID");
  }

  const partyId = usePartyId();
  const [peerStatuses, setPeerStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setRecentRoom(roomId);
  });

  useEffect(() => {
    const p2p = P2PConnection.createFor(partyId, roomId);

    const onPeerStatus = (partyId: string, connected: boolean) => {
      console.log("ps", partyId, connected);
      setPeerStatuses((peerStatuses) => ({
        ...peerStatuses,
        [partyId]: connected,
      }));
    };
    const onPeerMessage = (partyId: string, message: unknown) => {
      // TODO
      console.log("new peer message", partyId, message);
    };

    p2p.subscribeToPeerStatus(onPeerStatus);
    p2p.subscribeToPeerMessage(onPeerMessage);

    p2p.connect();

    return () => {
      p2p.unsubscribeFromPeerStatus(onPeerStatus);
      p2p.unsubscribeFromPeerMessage(onPeerMessage);
      p2p.close();
    };
  }, [roomId, partyId]);

  return (
    <>
      <Text>
        <ChakraLink as={RrLink} to="/">
          <ArrowBackIcon />
          Home
        </ChakraLink>
      </Text>

      <RoomTitle roomId={roomId} />

      <div>
        <PeerParties selfId={partyId} peerStatuses={peerStatuses} />
      </div>
    </>
  );
}

export default Room;
