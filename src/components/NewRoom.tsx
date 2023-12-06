import { useNavigate } from "react-router-dom";
import { Box, Button, Heading } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import { randomRoomSlug } from "../lib/roomSlug";

function NewRoom() {
  const navigate = useNavigate();
  const newRoomName = randomRoomSlug();
  return (
    <Box mt="3">
      <Heading size="sm">New Room:</Heading>
      <Button
        mt="1"
        rightIcon={<ArrowForwardIcon />}
        variant="outline"
        onClick={() => {
          navigate(`/room/${newRoomName}`);
        }}
      >
        Create and go to a new room "{newRoomName}"
      </Button>
    </Box>
  );
}

export default NewRoom;
