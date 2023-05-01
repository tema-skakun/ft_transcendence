import Popup from "reactjs-popup";
import { useCallback } from "react";

type InvitePopUpArgs = {
	displayPopUp: boolean;
	deactivatePopUp: () => void;
	invitedBy: [string, (res: string) => void];
};

export const InvitePopUp: React.FC<InvitePopUpArgs> = ({displayPopUp, deactivatePopUp, invitedBy}) => {

	const acceptInvitation = useCallback(() => {
		invitedBy[1]('I will destory you');
		deactivatePopUp();
	}, [invitedBy]);

	const rejectInvitation = useCallback(() => {
		invitedBy[1]('Fuck off');
		deactivatePopUp();
	}, [invitedBy]);

	return (
	< Popup open={displayPopUp} position='right center' onClose={deactivatePopUp}>
		<div>
			<p>invitedBy: {invitedBy[0]}</p>
			<button onClick={acceptInvitation}>feelin' lucky</button>
			<button onClick={rejectInvitation}>I don't fuck with you</button>
		</div>
	</Popup>)
}