import React from 'react';
import './Navigation.css';

import blogIcon from '../../../../assets/images/blog.svg';
import starIcon from '../../../../assets/images/star.svg';
import settingsIcon from '../../../../assets/images/settings.svg';

export const Navigation = () => {
	return (
		<nav className='nav'>
			<a href="/" className='active' >
				<img src={blogIcon} alt="Blog" />
				<span>Blog</span>
			</a>
			<a href="/">
				<img src={starIcon} alt="Star" />
				<span>Favorite</span>
			</a>
			<a href="/">
				<img src={settingsIcon} alt="Settings" />
				<span>Settings</span>
			</a>
		</nav>
	)
}

