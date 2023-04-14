import {NavLink} from 'react-router-dom';
import style from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={style.navbar}>
            <div>
                <NavLink
                    to='/profile'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    Profile
                </NavLink>

            </div>
            <div>
                <NavLink
                    to='/chat'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    Chat
                </NavLink>

            </div>
            <div>
                <NavLink
                    to='/game'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    Game
                </NavLink>

            </div>
        </div>
    )
}

export default Navbar;