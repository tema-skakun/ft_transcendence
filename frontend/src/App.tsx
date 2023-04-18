import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';
import JSCookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { userProps } from './props';
import { LoginPage } from './components/LoginPage/LoginPage';

function App(props: any) {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [is2f, setis2f] = useState<boolean>(false);
	const userdata = useRef<userProps>();

	useEffect(() => {
		const myCookie = JSCookies.get('accessToken');

		if (!isLoggedIn && myCookie) {
			const url = 'http://localhost:6969/authentication/log-in'; // replace with your API endpoint URL
			const headers = {
				'Content-Type': 'application/json', // set the appropriate Content-Type header
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			};
			fetch(url, {
				method: 'GET', // set the appropriate HTTP method
				headers: headers,
			})
			.then(response => {
			if (response.ok) {
				// handle success response
				return response.json();
			} else {
				// handle error response
				setis2f(true);
				throw new Error('Failed to authenticate2f');
				// setis2f(true);
			}
			})
			.then(data => {
				userdata.current = data;
				console.log(userdata.current);
				setIsLoggedIn(true);
			})
			.catch(error => {
			// handle error
				console.error(error);
			});
		}
	}, [isLoggedIn])

    return (
				isLoggedIn ? (
					<div className="App">
					<Navbar />
            		<Content state={ props.state } dispatch={ props.dispatch } setIsLoggedIn={setIsLoggedIn} userdata={userdata.current}/>
					</div>
				) : (
					<div className="App">
					<LoginPage setis2f={setis2f} is2f={is2f} setIsLoggedIn={setIsLoggedIn} userdata={userdata.current} />
					</div>
					)
    );
}

export default App;
