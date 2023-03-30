import './SideBar.css'
import { User } from './User/User'
import { Navigation } from './Navigation/Navigation'
import { LogOut } from './LogOut/LogOut'
import blockProps from '../../types'

export const SideBar = (props: blockProps) => {
	return (
		<aside className='sidebar'>
			<section className='sidebarTop'>
				<User setIsLoggedIn={props.setIsLoggedIn} userdata={props.userdata}/>
				<Navigation/>
			</section>
			<LogOut setIsLoggedIn={props.setIsLoggedIn} userdata={props.userdata} />
		</aside>
	)
}