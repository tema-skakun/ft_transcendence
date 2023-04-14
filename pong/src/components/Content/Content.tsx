import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Profile from "./Profile/Profile";
import Chat from "./Chat/Chat";
import Game from "./Game/Game";

interface Props {
    state: any;
}

const Content = (props:Props) => {
    return (
        <div className={style.content}>
            <Routes>
                <Route path='/profile' element={<Profile
                    state={props.state.profilePage}/>}/>
                <Route path='/chat' element={<Chat
                    state={props.state.chatPage}/>}/>
                <Route path='/game' element={<Game />}/>
            </Routes>
        </div>
    )
}

export default Content;