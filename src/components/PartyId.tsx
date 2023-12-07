import { Flex, Avatar, Box, Text } from "@chakra-ui/react";

import { usePartyId } from "../lib/partyId";

function PartyId() {
  const partyId = usePartyId();

  return (
    <Flex mt="3" mb="3">
      <Avatar name={partyId} />
      <Box ml="3">
        <Text fontWeight="bold">{partyId}</Text>
        <Text fontSize="sm">This is you</Text>
      </Box>
    </Flex>
  );
}

export default PartyId;
