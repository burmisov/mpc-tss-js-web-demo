import { Link as RrLink } from "react-router-dom";
import {
  Link as ChakraLink,
  Heading,
  UnorderedList,
  ListItem,
  Box,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import { useRecentRooms } from "../lib/recentRooms";

function RecentRooms() {
  const recentRooms = useRecentRooms();

  return (
    <Box mt="3">
      <Heading size="md">
        {recentRooms.length > 0 ? "Recent Rooms:" : "No Recent Rooms"}
      </Heading>
      <UnorderedList mt="2" spacing={1}>
        {recentRooms.map((room) => (
          <ListItem key={room}>
            <ChakraLink as={RrLink} to={`/room/${room}`}>
              {room} <ArrowForwardIcon />
            </ChakraLink>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

export default RecentRooms;
