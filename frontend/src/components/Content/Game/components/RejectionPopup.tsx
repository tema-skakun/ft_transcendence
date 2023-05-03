import { useCallback, useContext } from "react";
import Popup from "reactjs-popup";
import { changeProp, PopUpContext } from "../../../../PopUpContext";

export type RejectionPopupArgs = {
	showRejection: boolean;
	setShowRejection: (val: boolean) => any;
};

export const RejectionPopup: React.FC<any> = () => {
	const popUpState = useContext(PopUpContext);
	const {val, setter} = popUpState;

	const deactivateRejection = useCallback(() => {
		changeProp(setter, popUpState, {showRejection: false});
	}, [setter, popUpState])

	return (<div>
			<Popup open={val.showRejection} onClose={deactivateRejection} >
				<p>Other player has politely told you to fuck off.</p>
				<button onClick={deactivateRejection}>Got you braf</button>
			</Popup>
		</div>)
}
