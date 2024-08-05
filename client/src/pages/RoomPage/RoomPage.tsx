import { useCallback, useContext, useEffect, useState } from "react";
import "./RoomPage.scss";
import { SocketContext } from "@/contexts/SocketContext";
import ReactPlayer from "react-player";
import peerInstance from "@/service/peer";

const RoomPage = () => {
  const { socket } = useContext(SocketContext);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream>();
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const handleCallUser = useCallback(async () => {
    console.log(`Calling user ${remoteSocketId}`);

    // get offer
    const offer = await peerInstance.getOffer();

    // emit user call event
    socket.emit("user:call", { to: remoteSocketId, offer });

    // create stream and set current state
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleUserJoined = useCallback(
    (data: { email: string; id: string }) => {
      console.log({ data });
      setRemoteSocketId(data?.id);
    },
    []
  );

  const handleIncomingCall = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      console.log("Incoming call", data);

      setMyStream(stream);

      setRemoteSocketId(data?.from);

      const ans = await peerInstance.getAnswer(data?.offer);
      console.log({ ans });

      socket.emit("call:accepted", { callerId: data?.from, ans });
    },
    [remoteSocketId]
  );

  const handleSendStream = useCallback(() => {
    for (const track of myStream?.getTracks()!) {
      peerInstance.peer?.addTrack(track, myStream!);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async (data: { from: string; ans: RTCSessionDescriptionInit }) => {
      console.log("Call Accepted");

      const { ans } = data;

      await peerInstance.setRemoteDescription(ans);

      handleSendStream();
    },
    [handleSendStream]
  );

  const handleIncomingNegotiation = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      const ans = await peerInstance.getAnswer(data?.offer);
      console.log("incoming nego", ans);

      socket.emit("peer:nego:done", { to: data?.from, ans });
    },
    []
  );

  const handleFinalNegotiation = useCallback(
    async (data: { from: string; ans: RTCSessionDescriptionInit }) => {
      const { ans } = data;
      console.log("finalNego", ans);

      await peerInstance.setRemoteDescription(ans);
    },
    []
  );

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    // this socket event is used to handle incoming negotiation socket event
    socket.on("peer:nego:needed", handleIncomingNegotiation);

    socket.on("peer:nego:final", handleFinalNegotiation);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleIncomingNegotiation);
      socket.off("peer:nego:final", handleFinalNegotiation);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleIncomingNegotiation,
    handleFinalNegotiation,
  ]);

  const handleTrack = useCallback((e: RTCTrackEvent) => {
    console.log({ streams: e?.streams });
    setRemoteStreams([...e?.streams]);
  }, []);

  // this event is fired when a REMOTE peer adds new audio or video to the connection
  useEffect(() => {
    peerInstance.peer?.addEventListener("track", handleTrack);

    return () => {
      peerInstance.peer?.removeEventListener("track", handleTrack);
    };
  }, [peerInstance.peer, handleTrack]);

  // event when LOCAL PEER makes audio and video changes, new offer is created and socket event is added
  const handleNegotiationNeeded = useCallback(async () => {
    console.log("handleNegoNeeded");
    const offer = await peerInstance.getOffer();

    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [socket, remoteSocketId]);

  /**
   * this event is fired when the LOCAL PEER(MYSELF) make changes to stream:
   * Turn off/onn video or audio
   * Improve video resolution
   * Modifying audio settings
   *
   * When triggered, it typically starts a new offer/answer exchange to update the connection parameters.
   */
  useEffect(() => {
    peerInstance.peer?.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );

    return () => {
      peerInstance.peer?.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [peerInstance.peer, handleNegotiationNeeded]);

  return (
    <div>
      <h1>Room Page</h1>

      <div>{remoteSocketId ? "Connected" : "Disconnected"}</div>

      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && <button onClick={handleSendStream}>Send Stream</button>}

      {myStream && (
        <div className="flex-center">
          <h1>My Stream</h1>

          <ReactPlayer
            playing
            muted
            width="400px"
            height="200px"
            url={myStream}
          />
        </div>
      )}

      {!!remoteStreams.length && (
        <div className="flex-center">
          <h1>Remote Streams</h1>

          <div className="flex-center flex-column gap-1">
            {remoteStreams.map((streamItem, key) => {
              return (
                <ReactPlayer
                  playing
                  muted
                  width="400px"
                  height="200px"
                  url={streamItem}
                  key={key}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
