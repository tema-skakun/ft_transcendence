import { Injectable } from "@nestjs/common";
import { GameGateway, eventFunction } from "./game.gateway";
import { Client } from "./classes/client";
import CONFIG from "./constants";

@Injectable()
export class ExperimentalService {
	constructor(
		private gameGateway: GameGateway
	) {
		gameGateway.newCallback((client: Client) => {
			client.emit('handshake', JSON.stringify(CONFIG));
			console.log('Handshake is emitted');
		})
	}
}
