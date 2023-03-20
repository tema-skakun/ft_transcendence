import React from 'react';
import { ReactComponent as ArrowLeftIcon } from '../../../../assets/images/arrow_left.svg';
import './LogOut.css';

export const LogOut = ({ setIsLoggedIn }) => {

	const LogOut = () => setIsLoggedIn(false)

	return (
	<section className="sidebarBottom">
		<button onClick={LogOut}>
			<ArrowLeftIcon height={30} width={30}/>
			<span>Exit</span>
		</button>
	</section>
	)
}
