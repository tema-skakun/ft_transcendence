import { Injectable } from '@nestjs/common';
import { HUMAN_LOGGER, LOGGER } from './logger';

interface debugFormat
{
	key: string;
	value: string;
}

type DebugFunction = () => debugFormat;

@Injectable()
export class DebugService {
	private states: DebugFunction [];

	private kickoff() {
		setInterval(() => {
			if (this.states.length > 0)
			{
				let acc_human = "";
				let acc = {};
				for (const state of this.states) {
					acc[state().key] = state().value;
					acc_human += state().key + " " + state().value + "\n"
				}
				acc_human += "\n";
				LOGGER.debug(JSON.stringify(acc));
				HUMAN_LOGGER.debug(acc_human)
			}
		}, 1000);
	}

	constructor() {
		this.states = [];
		this.kickoff()
	}

	add(callback: DebugFunction) {
		this.states.push(callback);
	}
}
