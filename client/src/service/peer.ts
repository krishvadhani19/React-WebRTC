class PeerService {
  private static instance: PeerService | null = null;

  peer: RTCPeerConnection | null = null;

  public static getInstance = (): PeerService => {
    if (!PeerService.instance) {
      PeerService.instance = new PeerService();
    }

    return PeerService.instance;
  };

  private initializePeer = () => {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  };

  // this is when you accept the call
  getAnswer = async (
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> => {
    // the user accepting call peer is not initialized yet
    this.initializePeer();

    // Setting remote description for the current peer as offer sent from new joining user
    await this.peer?.setRemoteDescription(offer);

    const ans = await this.peer?.createAnswer();
    await this.peer?.setLocalDescription(new RTCSessionDescription(ans!));

    return ans!;
  };

  // set remote description for the user calling
  setRemoteDescription = async (ans: RTCSessionDescriptionInit) => {
    if (this.peer) {
      console.log({ ans });
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  };

  getOffer = async (): Promise<RTCSessionDescriptionInit> => {
    this.initializePeer();

    if (!this.peer) {
      throw new Error("Failed to initialize peer connection");
    }

    console.log(this.peer);

    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };
}

export default PeerService.getInstance();
