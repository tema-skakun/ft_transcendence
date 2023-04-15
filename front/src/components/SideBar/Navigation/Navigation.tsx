import React from "react";
import './Navigation.css';

export const Navigation = () => {

	return (
		<nav className="nav">
			<a href="/" className="active" >
				<span>Blog</span>
			</a>
			<a href="/">
				<span>Favorite</span>
			</a>
			<a href="/">
				<span>Settings</span>
			</a>
		</nav>
	)
}