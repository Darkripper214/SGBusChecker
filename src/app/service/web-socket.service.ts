import { Injectable, ɵConsole } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const RES_TYPE_CONNECTED = 'CONNECTED';
const RES_TYPE_SERVER_RESPOND = 'RESPOND';
const REQ_TYPE_CLIENT_REQUEST = 'REQUEST';
const REQ_TYPE_CLIENT_PING = 'CLIENT_PING';
const RES_TYPE_SERVER_PING = 'SERVER_PING';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private sock: WebSocket;
  socketState: boolean = false;
  private arrivalUpdate = new Subject<{}>();
  arrivalObservable = this.arrivalUpdate as Observable<{}>;
  constructor() {}

  subLiveUpdate(stopCode: number) {
    let url = location.origin;
    // Brute Force change address and port, to revise implementation
    url = url.replace('4200', '3000');
    url = url.replace('http', 'ws') + `/api/busarrival/ws/${stopCode}`;
    this.sock = new WebSocket(url);

    this.sock.onmessage = (payload: MessageEvent) => {
      let msg = JSON.parse(payload['data']);

      switch (msg['type']) {
        case RES_TYPE_CONNECTED:
          console.log('Connection successful');
          this.socketState = true;
          break;
        case RES_TYPE_SERVER_RESPOND:
          console.log('Received bus arrival update from server');
          this.arrivalUpdate.next(msg['data']);
          break;
        case RES_TYPE_SERVER_PING:
          console.log('Received return ping from server');
          break;
        default:
          break;
      }
    };

    // handle accidental error
    this.sock.onclose = () => {
      this.socketState = false;
      console.log('closing');
      if (this.sock != null) {
        console.log(this.sock);
        this.sock = null;
      }
    };
  }
  // Request for update from server
  requestUpdate(stopCode: number) {
    const payload = JSON.stringify({
      type: REQ_TYPE_CLIENT_REQUEST,
      stopCode: stopCode,
    });
    this.sock.send(payload);
  }

  // Ping server to ensure connection is alive due to Heroku 55sec timeout
  pingServer() {
    const payload = JSON.stringify({
      type: REQ_TYPE_CLIENT_PING,
    });
    this.sock.send(payload);
  }

  close() {
    if (this.sock != null) {
      this.socketState = false;
      this.sock.close();
      this.sock = null;
    }
  }
}
