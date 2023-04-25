import style from './Profile.module.css'

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
        </div>
    )
}

export default Profile;
