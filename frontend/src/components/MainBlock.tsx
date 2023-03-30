import './MainBlock.css'
import { SideBar } from './SideBar/SideBar'
import blockProps from '../types'


export const MainBlock = (props: blockProps) => {
	return (
		<>
			<SideBar setIsLoggedIn={props.setIsLoggedIn} userdata={props.userdata} />
			<main className='mainBlock'>
	
			</main>
		</>
	)
}