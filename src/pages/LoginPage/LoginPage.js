import './LoginPage.css'

export const LoginPage = ( { setIsLoggedIn } ) => {

	const logIn = () => setIsLoggedIn(true)

	return (
		<form className="loginForm">
			<h1>Sign in to Pong</h1>
			<div>
				<input type="text" placeholder="Login" name="login" />
			</div>
			<div>
				<input type="password" placeholder="Password" name="password" />
			</div>
			<div>
				<button onClick={logIn}>Sign in</button>
			</div>
		</form>
	)
}
