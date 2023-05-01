import Popup from "reactjs-popup";
import { useCallback } from "react";

type InvitePopUpArgs = {
	displayPopUp: boolean;
	deactivatePopUp: () => void;
	invitedBy: [string, (res: string) => void];
	setDisplayBtn: (val: boolean) => any;
};

export const InvitePopUp: React.FC<InvitePopUpArgs> = ({displayPopUp, deactivatePopUp, invitedBy, setDisplayBtn}) => {

	const acceptInvitation = useCallback(() => {
		invitedBy[1]('I will destory you');
		deactivatePopUp();
		setDisplayBtn(false);
	}, [invitedBy, deactivatePopUp, setDisplayBtn]);

	const rejectInvitation = useCallback(() => {
		invitedBy[1]('Fuck off');
		deactivatePopUp();
	}, [invitedBy, deactivatePopUp]);

	return (
	< Popup open={displayPopUp} position='right center' onClose={deactivatePopUp}>
		<div>
			<p>invitedBy: {invitedBy[0]}</p>
			<button onClick={acceptInvitation}>feelin' lucky</button>
			<button onClick={rejectInvitation}>I don't fuck with you</button>
		</div>
	</Popup>)
}