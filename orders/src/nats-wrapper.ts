import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client: Stan;
  
  get client() {
    if (!this._client) {
      throw new Error('Can not access client before connect to NATS Server');
    }
    return this._client;
  }

  connect(clusterID: string, clientID: string, url: string) {
    this._client = nats.connect(clusterID, clientID, { url });
    return new Promise((resolve, reject) => {
      this._client.on('connect', () => {
        console.log(`Connected to NATS`);
        resolve(null);
      });
      this._client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
