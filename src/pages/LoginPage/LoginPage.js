import './LoginPage.css'

export const LoginPage = ( { setIsLoggedIn } ) => {

	const logIn = () => setIsLoggedIn(true)//

	return (
		//check fields of form, if type='submit' -> change page
		<form onSubmit={logIn} className="loginForm">
			<h1>Sign in to Pong</h1>
			<div>
				<input type="text" placeholder="Login" name='login' required />
			</div>
			<div>
				<input type="password" placeholder="Password" name='password' required />
			</div>
			<div>
				<button type='submit'>Sign in</button>
			</div>
		</form>
	)
}
