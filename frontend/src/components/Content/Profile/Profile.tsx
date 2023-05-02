import style from './Profile.module.css';
import axios from 'axios';
import defaultAvatar from '../../../assets/images/defaultAvatar.png'

const Profile = (props: any) => {

    let getFriends = () => {
        if (props.profilePage.users.length === 0) {
            axios.get("https://social-network.samuraijs.com/api/1.0/users")
                .then((response: any) => {
                    props.setUsers(response.data.items)
                })
            //старые данные
            // props.setUsers([
            //         {
            //             id: 1,
            //             name: 'Linus',
            //             avatarLink: 'https://i.pinimg.com/originals/c1/f2/5f/c1f25f71f7dbc8413da545076118e054.jpg',
            //             followed: true,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'online'
            //         },
            //         {
            //             id: 2,
            //             name: 'Boris',
            //             avatarLink: 'https://99px.ru/sstorage/1/2015/11/image_11111151003517187270.jpg',
            //             followed: true,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'online'
            //         },
            //         {
            //             id: 3,
            //             name: 'Paul',
            //             avatarLink: 'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/224480/P5jfvm3cJ7RzrPVLeo4kHA.jpg',
            //             followed: false,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'online'
            //         },
            //         {
            //             id: 4,
            //             name: 'Evgeniy',
            //             avatarLink: 'https://cs14.pikabu.ru/post_img/2022/05/23/5/1653287994258846794.jpg',
            //             followed: true,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'online'
            //         },
            //         {
            //             id: 5,
            //             name: 'Anton',
            //             avatarLink: 'https://bipbap.ru/wp-content/uploads/2017/11/5_ja7.jpg',
            //             followed: false,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'online'
            //         },
            //         {
            //             id: 6,
            //             name: 'Alexander',
            //             avatarLink: 'https://proprikol.ru/wp-content/uploads/2019/08/kartinki-volk-iz-nu-pogodi-19.jpg',
            //             followed: false,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'in a game'
            //         },
            //         {
            //             id: 7,
            //             name: 'Pablo',
            //             avatarLink: 'https://souzmult.ru/api/images/character-5d75efa0dfe23.svg',
            //             followed: false,
            //             location: {country: 'Germany', city: 'Wolfsburg'},
            //             status: 'offline'
            //
            //         }
            //     ]
        }
    }

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
                <button onClick={getFriends}>Get Friends</button>
                <div>
                    {
                        props.profilePage.users.map((u: any) => <div key={u.id}>
                            <span>
                                <div>
                                    <img
                                        src={u.photos.small != null ? u.photos.small : defaultAvatar}
                                        alt="Avatar User"
                                    />
                                </div>
                                <div>
                                    {u.followed
                                        ? <button onClick={() => {
                                            props.unfollow(u.id)
                                        }}>Unfollow</button>
                                        : <button onClick={() => {
                                            props.follow(u.id)
                                        }}>Follow</button>}
                                </div>
                            </span>
                            <span>
                                <span>
                                    <div>{u.name}</div>
                                    <div>{u.status}</div>
                                </span>
                                <span>
                                    <div>{'u.location.country'}</div>
                                    <div>{'u.location.city'}</div>
                                </span>
                            </span>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;
