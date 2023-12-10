type PeerData = {
  partyId: string,
  status: 'connected' | 'disconnected',
};

type PeerStatusListener = (partyId: string, connected: boolean) => void;
type PeerMsgListener = (partyId: string, msg: unknown) => void;

const WS_CHAT_SERVER_URL = 'wss://simple-websocket-rooms.fly.dev';

export class P2PConnection {
  private static connections: Record<string, P2PConnection> = {};

  public readonly partyId: string;
  public readonly roomId: string;
  private _ws?: WebSocket;
  private peers: Record<string, PeerData> = {};
  private peerStatusListeners: PeerStatusListener[] = [];
  private peerMsgListeners: PeerMsgListener[] = [];

  private get ws(): WebSocket {
    if (!this._ws) {
      throw new Error('ws not initialized');
    }
    return this._ws;
  }

  private constructor(partyId: string, roomId: string) {
    this.partyId = partyId;
    this.roomId = roomId;
  }

  public static createFor(partyId: string, roomId: string): P2PConnection {
    const key = `${partyId}-${roomId}`;
    if (!P2PConnection.connections[key]) {
      const conn = new P2PConnection(partyId, roomId);
      P2PConnection.connections[key] = conn;
    }
    return P2PConnection.connections[key];
  }

  private connectOrReconnect() {
    if (this._ws) {
      this._ws.close();
    }
    this._ws = new WebSocket(WS_CHAT_SERVER_URL);
    this.ws.onopen = this.handleWsOpen.bind(this);
    this.ws.onclose = this.handleWsClose.bind(this);
    this.ws.onmessage = this.handleWsMessage.bind(this);
    this.ws.onerror = this.handleWsError.bind(this);

    this.peerStatusListeners.forEach((listener) => {
      listener(this.partyId, true);
    });
  }

  public connect() {
    this.connectOrReconnect();
  }

  private handleWsOpen() {
    console.log('ws open');
    this.ws.send(JSON.stringify({
      action: 'subscribe',
      partyId: this.partyId,
      roomId: this.roomId,
    }));
  }

  private handleWsClose(event: unknown) {
    console.log('ws close', event, 'reconnecting');
    this.connectOrReconnect();
  }

  private handleWsError(event: Event) {
    console.log('ws error event', event);
    // TODO
  }

  private handleWsMessage(event: Event) {
    const body = JSON.parse((event as MessageEvent).data);
    console.log('ws message', body);
    if (body.error) {
      console.error('chat error', body.error);
      return;
    }
    if (body.action === 'presence') {
      this.handlePeerPresence(
        body.fromPartyId as string,
        body.roomId as string,
        body.online as boolean
      );
      return;
    }
    if (body.action === 'message') {
      this.handlePeerMsg(
        body.fromPartyId as string,
        body.roomId as string,
        body.msg as string
      );
      return;
    }
  }

  private handlePeerPresence(partyId: string, roomId: string, online: boolean) {
    console.log('handling presence', partyId, roomId, online);
    if (roomId !== this.roomId) {
      return;
    }
    if (online) {
      this.handlePeerConnect(partyId);
    } else {
      this.handlePeerClose(partyId);
    }
  }

  private handlePeerConnect(partyId: string) {
    const peerData: PeerData = {
      partyId,
      status: 'connected',
    };
    this.peers[partyId] = peerData;

    this.peerStatusListeners.forEach((listener) => {
      listener(peerData.partyId, true);
    });
  }

  private handlePeerClose(partyId: string) {
    const peerData = this.peers[partyId];
    if (peerData) {
      peerData.status = 'disconnected';
    }
    this.peerStatusListeners.forEach((listener) => {
      listener(partyId, false);
    });
  }

  private handlePeerMsg(partyId: string, roomId: string, msg: string) {
    if (roomId !== this.roomId) {
      return;
    }
    const msgJson = JSON.parse(msg);

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

  private sendRawToPartyId(partyId: string, data: string) {
    const peerData = Object.values(this.peers)
      .find((peer) => peer.partyId === partyId);
    if (!peerData) {
      throw new Error(`No peer found for partyId ${partyId}`);
    }
    this.ws.send(JSON.stringify({
      action: 'message',
      partyId: this.partyId,
      toPartyId: partyId,
      roomId: this.roomId,
      msg: data,
    }));
  }

  public sendToPartyId(partyId: string, msg: unknown) {
    const msgStr = JSON.stringify(msg);
    this.sendRawToPartyId(partyId, msgStr);
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
    this.ws.onclose = null;
    this.ws.close();
  }
}
