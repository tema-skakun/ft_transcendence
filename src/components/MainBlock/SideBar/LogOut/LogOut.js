import React from 'react';
import { ReactComponent as ArrowLeftIcon } from '../../../../assets/images/arrow_left.svg';
import './LogOut.css';

export const LogOut = () => {
	return (
	<section className="sidebarBottom">
		<a href="/">
			<ArrowLeftIcon alt="Settings" height={30} width={30}/>
			<span>Exit</span>
		</a>
	</section>
	)
}
/*
<a href="/">
<img src={settingsIcon} alt="Settings" />
<span>Settings</span>
</a>
*/
