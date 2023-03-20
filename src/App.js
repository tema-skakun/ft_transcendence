import { useState } from 'react';
import './App.css';
import { MainBlock } from './components/MainBlock/MainBlock';
import { LoginPage } from './pages/LoginPage/LoginPage';

function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<div className="App">
			{
					isLoggedIn ? (/* if log in */
						<MainBlock />
						) : (/* else */
						<LoginPage setIsLoggedIn={setIsLoggedIn} />
						)
			}
		</div>
	);
}

export default App;
