
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainBlock } from './components/MainBlock';
import JSCookies from 'js-cookie';
import { io } from 'socket.io-client';
import { userProps } from './types';


const socket = io('http://localhost:3001');
function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const userdata = useRef<userProps>();


	useEffect(() => {
		const myCookie = JSCookies.get('accessToken');
		if (!isLoggedIn && myCookie) {
			socket.emit('login', myCookie);
			socket.on('login',(data) => {
				userdata.current = data;
				console.log(userdata.current);
				if (userdata)
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
