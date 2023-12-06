import { Link, useParams } from "react-router-dom";

function Room() {
  const { roomId } = useParams();
  return (
    <>
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>Room?</p>
      <p>Room id: {roomId}</p>
    </>
  );
}

export default Room;
