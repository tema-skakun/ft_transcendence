import { Navigation } from './Navigation/Navigation';
import { User } from './User/User';
import { LogOut } from './LogOut/LogOut';
import './SideBar.css';

export const SideBar = ({ setIsLoggedIn }) => {
	return (
		<aside className="sidebar">
			<section className="sibebarTop">
				<User />
				<Navigation />
			</section>
			<LogOut setIsLoggedIn={setIsLoggedIn} />
		</aside>
	);
};
