import {
  Heading,
  Highlight,
  HStack,
  IconButton,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

function RoomTitle({ roomId }: { roomId: string }) {
  const { onCopy } = useClipboard(roomId);
  const toast = useToast();
  return (
    <HStack>
      <Heading size="md">
        <Highlight
          query={roomId}
          styles={{ bg: "red.100", px: "2", py: "1", rounded: "full" }}
        >{`Room ${roomId}`}</Highlight>
      </Heading>
      <IconButton
        size="sm"
        aria-label="copy"
        icon={<CopyIcon />}
        onClick={() => {
          onCopy();
          toast({ description: "Room ID copied to clipboard" });
        }}
      />
    </HStack>
  );
}

export default RoomTitle;
