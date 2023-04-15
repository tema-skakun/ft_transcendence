
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainBlock } from './components/MainBlock';
import JSCookies from 'js-cookie';
import { userProps } from './types';

function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [is2f, setis2f] = useState<boolean>(false);
	const userdata = useRef<userProps>();


	useEffect(() => {
		const myCookie = JSCookies.get('accessToken');
		console.log('Token: ' + myCookie);

		if (!isLoggedIn && myCookie) {
			console.log('not logged in but have accessToken');
			const url = 'http://localhost:3333/authentication/log-in'; // replace with your API endpoint URL
			const headers = {
				'Content-Type': 'application/json', // set the appropriate Content-Type header
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			};
			console.log('myCookie before: ' + JSCookies.get('accessToken'));
			fetch(url, {
				method: 'GET', // set the appropriate HTTP method
				headers: headers,
			})
			.then(response => {
			if (response.ok) {
				// handle success response
				console.log('response ok');
				return response.json();
			} else {
				// handle error response
				console.log('response failed');
				setis2f(true);
				throw new Error('Failed to authenticate2f');
				// setis2f(true);
			}
			})
			.then(data => {
				console.log('data recived after login: ' + data);
				userdata.current = data;
				console.log(userdata.current);
				setIsLoggedIn(true);
			})
			.catch(error => {
			// handle error
				console.log('catched');
				console.error(error);
			});
		}
		console.log('not if in app.tsx');
	}, [isLoggedIn])

	return (
		<div className="App">
			{
				isLoggedIn ? (
					<MainBlock setIsLoggedIn={setIsLoggedIn} userdata={userdata.current}/>
				) : (
					<LoginPage setis2f={setis2f} is2f={is2f} setIsLoggedIn={setIsLoggedIn} userdata={userdata.current} />
				)
			}
		</div>
	);
}

export default App;
