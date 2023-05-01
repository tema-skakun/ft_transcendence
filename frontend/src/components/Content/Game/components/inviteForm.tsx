import React, { useState, useRef, useCallback } from "react"
import { Socket } from "socket.io-client";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';


export const InviteForm: React.FC<{socket: Socket<any, any> | null}> = ({socket}) => {
	const [inputVal, setInputVal] = useState<string>('');
	const [showRejection, setShowRejection] = useState<boolean>(false);

	const inputChangeHandler = (newInput: React.ChangeEvent<HTMLInputElement>) => {
		setInputVal(newInput.target.value);
	}

	const onClickHandler = () => {
		if (socket)
			socket.emit('invite', inputVal, (res: string) => {
				if (res === 'Fuck off') // the other player has rejected
				{
					setShowRejection(true);
				}

			});
		setInputVal('');
	}

	return (<div>
			<input value={inputVal} type='text' onChange={inputChangeHandler}/>
			<button onClick={onClickHandler} type='button'>invite</button>
			<Popup open={showRejection} onClose={() => setShowRejection(false)} >
				<p>Other player has politely told you to fuck off.</p>
				<button onClick={() => setShowRejection(false)}>Got you braf</button>
			</Popup>
		</div>)
}