import './LoginPage.css'
import logo from '../.././42.png';

async function signin() {
	try {
		window.location.assign('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-13c0b288c085cc7ea7e00c35299630ea691a16f62e69df962c35df1e235d3664&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code');
	} catch(error)
	{
		console.log("error in front name function");
		console.log(error);
	}
} 

export const LoginPage = () => {

	return (
		<div className="App">
			<header className="App-header">
			<img src={logo} alt="42" className="logo"/>
			<h2>
				Welcome to our ft_transcendence
			</h2>
				<div>
					<button className="signin-button" onClick={signin} >Sign in with 42 </button>
				</div>
			</header>
		</div>
	)
}