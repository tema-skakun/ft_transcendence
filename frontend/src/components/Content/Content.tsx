import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Profile from "./Profile/Profile";
import Chat from "./Chat/Chat";
import Game from "./Game/Game";
import { blockProps } from "../../props";

const Content = (props: any) => {
    return (
        <div className={ style.content }>
            <Routes>
                <Route path='/profile' element={<Profile
                    state={ props.state.profilePage } setIsLoggedIn={props.setIsLoggedIn} userdata={props.userdata}/>}/>
                <Route path='/chat' element={
                    <Chat
                        chatPage={ props.state.chatPage }
                        dispatch={ props.dispatch }
                    />}
                />
                <Route path='/game' element={<Game state={ props.state.gamePage }/>}/>
            </Routes>
        </div>
    )
}

export default Content;