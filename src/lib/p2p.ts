// @ts-expect-error has no types
import P2PCF from 'p2pcf';

type P2PCFPeer = {
  id: string;
  client_id: string;
};

type PeerData = {
  p2pcfPeer: P2PCFPeer;
  p2pcfId: string;
  partyId: string;
  status: 'connected' | 'disconnected';
};

type PeerStatusListener = (partyId: string, connected: boolean) => void;
type PeerMsgListener = (partyId: string, msg: unknown) => void;

export class P2PConnection {
  private static connections: Record<string, P2PConnection> = {};

  public readonly partyId: string;
  public readonly roomId: string;
  private p2pcf: P2PCF;
  private peers: Record<string, PeerData> = {};
  private peerStatusListeners: PeerStatusListener[] = [];
  private peerMsgListeners: PeerMsgListener[] = [];

  private constructor(partyId: string, roomId: string) {
    this.partyId = partyId;
    this.roomId = roomId;
  }

  public static createFor(partyId: string, roomId: string): P2PConnection {
    const key = `${partyId}-${roomId}`;
    if (!P2PConnection.connections[key]) {
      const conn = new P2PConnection(partyId, roomId);
      P2PConnection.connections[key] = conn;
      conn.connect();
    }
    return P2PConnection.connections[key];
  }

  private connect() {
    // TODO; for now use defaults incuding public signaling server
    const options = {};

    this.p2pcf = new P2PCF(this.partyId, this.roomId, options);
    this.p2pcf.on('peerconnect', this.handlePeerConnect.bind(this));
    this.p2pcf.on('peerclose', this.handlePeerClose.bind(this));
    this.p2pcf.on('msg', this.handleMsg.bind(this));

    this.p2pcf.start();
  }

  private handlePeerConnect(peer: P2PCFPeer) {
    const { id, client_id } = peer;
    const peerData: PeerData = {
      p2pcfPeer: peer,
      p2pcfId: id,
      partyId: client_id,
      status: 'connected',
    };
    this.peers[id] = peerData;

    this.peerStatusListeners.forEach((listener) => {
      listener(peerData.partyId, true);
    });
  }

  private handlePeerClose(peer: P2PCFPeer) {
    const { client_id } = peer as { id: string, client_id: string };
    const peerData = this.peers[client_id];
    if (peerData) {
      peerData.status = 'disconnected';
    }
    this.peerStatusListeners.forEach((listener) => {
      listener(client_id, false);
    });
  }

  private handleMsg(peer: P2PCFPeer, data: Uint8Array) {
    const { client_id: partyId } = peer;
    const msgStr = new TextDecoder().decode(data);
    const msgJson = JSON.parse(msgStr);

    this.peerMsgListeners.forEach((listener) => {
      listener(partyId, msgJson);
    });
  }

  public getConnectedParties(): string[] {
    return Object.values(this.peers)
      .filter((peer) => peer.status === 'connected')
      .map((peer) => peer.partyId);
  }

  public getAllParties(): Array<{ partyId: string, connected: boolean }> {
    return Object.values(this.peers)
      .map((peer) => ({
        partyId: peer.partyId,
        connected: peer.status === 'connected',
      }));
  }

  private sendRawToPartyId(partyId: string, data: Uint8Array) {
    const peerData = Object.values(this.peers)
      .find((peer) => peer.partyId === partyId);
    if (!peerData) {
      throw new Error(`No peer found for partyId ${partyId}`);
    }
    this.p2pcf.send(peerData.p2pcfPeer, data);
  }

  public sendToPartyId(partyId: string, msg: unknown) {
    const msgStr = JSON.stringify(msg);
    const msgData = new TextEncoder().encode(msgStr);
    this.sendRawToPartyId(partyId, msgData);
  }

  public subscribeToPeerStatus(listener: PeerStatusListener) {
    this.peerStatusListeners.push(listener);
  }

  public subscribeToPeerMessage(listener: PeerMsgListener) {
    this.peerMsgListeners.push(listener);
  }

  public unsubscribeFromPeerStatus(listener: PeerStatusListener) {
    this.peerStatusListeners =
      this.peerStatusListeners.filter((l) => l !== listener);
  }

  public unsubscribeFromPeerMessage(listener: PeerMsgListener) {
    this.peerMsgListeners =
      this.peerMsgListeners.filter((l) => l !== listener);
  }

  public close() {
    delete P2PConnection.connections[`${this.partyId}-${this.roomId}`];
    this.p2pcf.destroy();
  }
}
