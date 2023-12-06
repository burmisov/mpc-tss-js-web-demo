import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { isValidRoomSlug } from "../lib/roomSlug";

function NewRoom() {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");

  const buttonText = room
    ? isValidRoomSlug(room)
      ? `Go to "${room}"`
      : `(invalid name "${room}")`
    : "(enter room name)";

  return (
    <FormControl mt="4" mb="4">
      <FormLabel>Go To a Known Room:</FormLabel>
      <Input
        placeholder="room slug"
        value={room}
        onChange={(event) => setRoom(event.target.value)}
      />
      <Button
        mt="1"
        rightIcon={<ArrowForwardIcon />}
        variant="outline"
        isDisabled={!room || !isValidRoomSlug(room)}
        onClick={() => {
          navigate(`/room/${room}`);
        }}
      >
        {buttonText}
      </Button>
    </FormControl>
  );
}

export default NewRoom;
