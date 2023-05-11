import axios from "axios";
import React from "react";
import JSCookies from 'js-cookie';
import Friends from "./Friends";

const BACKEND_PORT: string = ':6969';
const URL: string = '/friends/displayable';

const URL_FOR_DEL_FRIENDS: string = '/friends/';

const BACKEND_ADDR: string = "http://" + process.env.REACT_APP_IP_BACKEND + BACKEND_PORT + URL;
const ROOT_ADDR_OF_FRIENDS: string = "http://" + process.env.REACT_APP_IP_BACKEND + BACKEND_PORT + URL_FOR_DEL_FRIENDS;

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

class FriendsAPIComponent extends React.Component<any, any> {
    componentDidMount() {
        axios.get(BACKEND_ADDR, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            }
        })
            .then((response: any) => {
                this.props.setUsers(response.data);
            })
    }

    render() {
        return (
            <Friends
                users={this.props.profilePage.users}
                follow={this.props.follow}
                unfollow={this.props.unfollow}
            />
        )
    }
}

export default FriendsAPIComponent