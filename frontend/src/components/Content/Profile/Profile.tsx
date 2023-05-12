import style from './Profile.module.css';
import FriendsAPIComponent from "./Friends/FriendsAPIComponent";
const Profile = (props: any) => {
    return (
        <div className={style.profile}>
            <img
                src={props.profilePage.user.userAvatar}
                alt="Avatar"
            />
            <div className={style.name}>
                {props.profilePage.user.name}
            </div>
            <div className={style.stat}>
                Match history
				
            </div>
            <div className={style.friends}>
                Friends
                <FriendsAPIComponent
                    profilePage={props.profilePage}
                    setUsers={props.setUsers}
                    follow={props.follow}
                    unfollow={props.unfollow}
                />
            </div>
        </div>
    )
}

export default Profile;
