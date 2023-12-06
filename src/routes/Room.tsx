import { useParams } from "react-router-dom";

function Room() {
  const { roomId } = useParams();
  return (
    <>
      <p>Room?</p>
      <p>Room id: {roomId}</p>
    </>
  );
}

export default Room;
