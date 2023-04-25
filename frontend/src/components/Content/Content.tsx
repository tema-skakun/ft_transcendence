import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Game from "./Game/Game";
import ChatContainer from "./Chat/ChatContainer";
import ProfileContainer from "./Profile/ProfileContainer";

const Content = (props: any) => {

    return (
        <div className={style.content}>
            <Routes>
                <Route path='/profile' element={
                    <ProfileContainer store={props.store}/>}
                />
                <Route path='/chat' element={
                    <ChatContainer store={props.store}/>}
                />
                <Route path='/game' element={<Game/>}/>
            </Routes>
        </div>
    )
}

export default Content;