import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Profile from "./Profile/Profile";
import Game from "./Game/Game";
import ChatContainer from "./Chat/ChatContainer";

const Content = (props: any) => {
    return (
        <div className={style.content}>
            <Routes>
                <Route path='/profile' element={
                    <Profile
                        state={props.state.profilePage}
                        setIsLoggedIn={props.setIsLoggedIn}
                        userdata={props.userdata}
                    />}
                />
                <Route path='/chat' element={
                    <ChatContainer store={props.store}/>}
                />
                <Route path='/game' element={<Game state={props.state.gamePage}/>}/>
            </Routes>
        </div>
    )
}

export default Content;