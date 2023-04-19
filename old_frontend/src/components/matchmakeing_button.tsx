
export type QueueBtnArgs = {
	handler: Function;
}

export const QueueButton: React.FC<QueueBtnArgs> = ({
	handler
}) => {
	return (<button onClick={() => handler()}>Matchmakeing</button>)
}
