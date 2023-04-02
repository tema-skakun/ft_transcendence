import { Socket } from 'socket.io';

export class Client extends Socket {
	public playerNum: number;
  
	constructor(socket: Socket) {
	  super(socket.nsp, socket.client, {
		token: "123"
	  });
	  Object.assign(this, socket);
  
	  this.playerNum = undefined;
  
	  console.log(`A client with id ${this.id} got registered`);
	}
  }
