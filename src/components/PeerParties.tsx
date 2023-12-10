import { Avatar, Box, Flex, Text, AvatarBadge } from "@chakra-ui/react";

function PeerParty({
  partyId,
  status,
  isSelf,
}: {
  partyId: string;
  status: boolean;
  isSelf: boolean;
}) {
  return (
    <Flex mt="3">
      <Avatar name={partyId}>
        <AvatarBadge boxSize="1.25em" bg={status ? "green.500" : "red.500"} />
      </Avatar>
      <Box ml="3">
        <Text fontWeight="bold">{partyId}</Text>
        <Text fontSize="sm">{isSelf ? "this is you" : ""}</Text>
      </Box>
    </Flex>
  );
}

function PeerParties({
  selfId,
  peerStatuses,
}: {
  selfId: string;
  peerStatuses: Record<string, boolean>;
}) {
  const selfStatus = peerStatuses[selfId] ?? false;
  return (
    <div>
      <PeerParty
        key={selfId}
        partyId={selfId}
        status={selfStatus}
        isSelf={true}
      />
      {Object.entries(peerStatuses)
        .filter(([partyId]) => partyId !== selfId)
        .map(([partyId, status]) => (
          <PeerParty
            key={partyId}
            partyId={partyId}
            status={status}
            isSelf={false}
          />
        ))}
    </div>
  );
}

export default PeerParties;
