import defaultAvatar from "../../../../assets/images/defaultAvatar.png";
import axios from "axios";
import React from "react";
import JSCookies from 'js-cookie';

const BACKEND_IP: string = 'http://localhost';
const BACKEND_PORT: string = ':6969';
const URL: string = '/friends/displayable/106769';

const URL_FOR_DEL_FRIENDS: string = '/friends/106769';

const BACKEND_ADDR: string = BACKEND_IP + BACKEND_PORT + URL;
const ROOT_ADDR_OF_FRIENDS: string = BACKEND_IP + BACKEND_PORT + URL_FOR_DEL_FRIENDS;

type FriendDto = {
	name: string;
	id: number;
	pictureUrl?: string;
	status: string;
};

function unfriend(intraId: number) {
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
	};

	axios.delete(ROOT_ADDR_OF_FRIENDS, {
		method: 'DELETE',
		headers: headers,
	});
}

class Friends extends React.Component<any, any> {
    componentDidMount() {
		axios.get(BACKEND_ADDR)
			.then((response: any) => {
				this.props.setUsers(response.data);
			})
    }

    render() {
        return (
            <div>
                {
                    this.props.profilePage.users.map((u: FriendDto) => <div key={u.id}>
                            <span>
                                <div>
                                    <img
                                        src={u.pictureUrl != null ? u.pictureUrl : defaultAvatar}
                                        alt="Avatar User"
                                    />
                                </div>
                                <div>
                                        <button onClick={() => unfriend(u.id)}>Unfriend</button>
                                </div>
                            </span>
                        <span>
                                <span>
                                    <div>{u.name}</div>
                                    <div>{u.status}</div>
                                </span>
                            </span>
                    </div>)
                }
            </div>
        )
    }
}

export default Friends