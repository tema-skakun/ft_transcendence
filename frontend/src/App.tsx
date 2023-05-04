import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';
import JSCookies from 'js-cookie';
import {useEffect, useRef, useState} from 'react';
import {userProps} from './props';
import {LoginPage} from './components/LoginPage/LoginPage';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { InvitePopUp } from './components/Content/Game/components/InvitePopUp';

export let socket: Socket<any, any> | null = null;


function App() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [is2f, setis2f] = useState<boolean>(false);
    const userdata = useRef<userProps>();

    useEffect(() => {
        const myCookie = JSCookies.get('accessToken');

        if (!isLoggedIn && myCookie) {
            const url = 'http://localhost:6969/authentication/log-in';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            };
            fetch(url, {
                method: 'GET',
                headers: headers,
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        setis2f(true);
                        throw new Error('Failed to authenticate2f');
                    }
                })
                .then(data => {
                    userdata.current = data;
                    setIsLoggedIn(true);

					if (!socket)
					{
						socket = io('http://localhost:6969/game', {
							withCredentials: true,
							path: '/gameListener'
						});
					}
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isLoggedIn ? (
            <div className="App">
				<InvitePopUp socket={socket}/>
                <Navbar/>
                <Content/>
            </div>
        ) : (
            <div className="App">
                <LoginPage setis2f={setis2f} is2f={is2f} setIsLoggedIn={setIsLoggedIn} userdata={userdata.current}/>
            </div>
        )
    );
}

export default App;
