import { useState } from 'react';
import './App.css';
import { MainBlock } from './components/MainBlock/MainBlock';
import { LoginPage } from './pages/LoginPage/LoginPage';

function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<div className="App">
			{
					isLoggedIn ? (
						<MainBlock setIsLoggedIn={setIsLoggedIn}/>/* if login */
						) : (
						<LoginPage setIsLoggedIn={setIsLoggedIn} />/* else */
						)
			}
		</div>
	);
}

export default App;
