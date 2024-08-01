import { useCallback, useContext, useEffect, useState } from "react";
import "./RoomPage.scss";
import { SocketContext } from "@/contexts/SocketContext";
import ReactPlayer from "react-player";

const RoomPage = () => {
  const { socket } = useContext(SocketContext);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream>();

  const handleUserJoined = useCallback(
    (data: { email: string; id: string }) => {
      console.log({ data });
      setRemoteSocketId(data?.id);
    },
    []
  );

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div>
      <h1>Room Page</h1>

      <div>{remoteSocketId ? "Connected" : "Disconnected"}</div>

      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      {myStream && (
        <ReactPlayer
          playing
          muted
          width="400px"
          height="200px"
          url={myStream}
        />
      )}
    </div>
  );
};

export default RoomPage;
