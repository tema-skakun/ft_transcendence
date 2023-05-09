import defaultAvatar from "../../../../assets/images/defaultAvatar.png";
import axios from "axios";
import React from "react";

class Friends extends React.Component<any, any> {
    componentDidMount() {
        axios.get("https://social-network.samuraijs.com/api/1.0/users")
            .then((response: any) => {
                this.props.setUsers(response.data.items)
            });
    }

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
            //     ]
    render() {
        return (
            <div>
                {
                    this.props.profilePage.users.map((u: any) => <div key={u.id}>
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
                                            this.props.unfollow(u.id)
                                        }}>Unfollow</button>
                                        : <button onClick={() => {
                                            this.props.follow(u.id)
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
        )
    }
}

export default Friends