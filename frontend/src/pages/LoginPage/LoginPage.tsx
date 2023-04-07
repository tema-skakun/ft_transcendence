import './LoginPage.css'
import logo from '../.././42.png';
import { useState } from 'react';
import blockProps, { twofprops } from '../../types';
import socket from '../../socket';

async function signin() {
	try {
		window.location.assign('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-13c0b288c085cc7ea7e00c35299630ea691a16f62e69df962c35df1e235d3664&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code');
	} catch(error)
	{
		console.log(error);
	}
} 

export const LoginPage = (props: twofprops) => {
	// const [is2f, setis2f] = useState<boolean>(props.userdata?.isTwoFactorAuthenticationEnabled || false);
	const [activationCode, setactivationCode] = useState<string>('');

	console.log('sss');
	console.log(props.is2f)
	console.log('sss111');
	const handleActivationCode = (event: React.ChangeEvent<HTMLInputElement>) => {
		setactivationCode(event.target.value);
	}

	const formSubmit = async (e: any) => {
		e.preventDefault();
		console.log('yooo');
	  };

	return (
		<div className="App">
			<header className="App-header">
			<img src={logo} alt="42" className="logo"/>
			<h2>
				Welcome to our ft_transcendence
			</h2>
			{ !props.is2f ? (
				<div>
					<button className="signin-button" onClick={signin} >Sign in with 42 </button>
				</div>
				) : (
					<form onSubmit={formSubmit}>
					<label>
						Code:
						<input type="text" value={activationCode} onChange={handleActivationCode} />
					</label>
					<button> Submit </button>
					</form>
				)
			}
			</header>
		</div>
	)
}