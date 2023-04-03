
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainBlock } from './components/MainBlock';
import JSCookies from 'js-cookie';
import { userProps } from './types';
import socket from './socket';

function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const userdata = useRef<userProps>();


	useEffect(() => {
		const myCookie = JSCookies.get('accessToken');
		if (!isLoggedIn && myCookie) {
			socket.emit('login', {
				myCookie,
			});
			socket.on('login',(data) => {
				userdata.current = data;
				if (userdata.current)
					setIsLoggedIn(true);
			});
		}
	}, [isLoggedIn])

	return (
		<div className="App">
			{
				isLoggedIn ? (
					<MainBlock setIsLoggedIn={setIsLoggedIn} userdata={userdata.current}/>
				) : (
					<LoginPage />
				)
			}
		</div>
	);
}

export default App;
