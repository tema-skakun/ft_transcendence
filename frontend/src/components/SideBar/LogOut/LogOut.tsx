import React from "react";
import './LogOut.css'
import blockProps from "../../../types";
import JSCookies from 'js-cookie';

export const LogOut = (props: blockProps) => {
	const LogOut = () => {
		JSCookies.remove('accessToken');
		props.setIsLoggedIn(false);
	}

	return (
		<section className="sidebarBottom">
			<button onClick={LogOut}>
				<span>Exit</span>
			</button>
		</section>
	)
}