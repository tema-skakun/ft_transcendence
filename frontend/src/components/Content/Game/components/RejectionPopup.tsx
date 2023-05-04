import { useCallback, useContext, useState } from "react";
import Popup from "reactjs-popup";
import { changeProp, PopUpContext } from "../../../../PopUpContext";
import { Socket } from "socket.io-client";

export type RejectionPopupArgs = {
	// showRejection: boolean;
	// setShowRejection: (val: boolean) => any;
	socket: Socket<any, any>;
};

export const RejectionPopup: React.FC<RejectionPopupArgs> = ({socket}) => {
	const [showRejection, setShowRejection] = useState<boolean>(false);

	const deactivateRejection = useCallback(() => {
		setShowRejection(false);
	}, [setShowRejection])

	

	return (<div>
			<Popup open={showRejection} onClose={deactivateRejection} >
				<p>Other player has politely told you to fuck off.</p>
				<button onClick={deactivateRejection}>Got you braf</button>
			</Popup>
		</div>)
}
