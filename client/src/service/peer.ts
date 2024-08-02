class PeerService {
  private static instance: PeerService | null = null;

  private peer: RTCPeerConnection | null = null;

  public static getInstance = (): PeerService => {
    if (!PeerService.instance) {
      PeerService.instance = new PeerService();
    }

    return PeerService.instance;
  };

  private initializePeer = () => {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });
    }
  };

  getOffer = async (): Promise<RTCSessionDescriptionInit> => {
    this.initializePeer();

    if (!this.peer) {
      throw new Error("Failed to initialize peer connection");
    }

    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };
}

export default PeerService.getInstance();
