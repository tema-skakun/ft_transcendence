import {connect} from "react-redux";
import Profile from "./Profile";
import {followAC, setUsersAC, unfollowAC} from "../../../Redux/profile-reducer";

let mapStateToProps = (state: any) => {
    return {
        profilePage: state.profilePage
    }
}
let mapDispatchToProps = (dispatch: any) => {
    return {
        follow: (userId:any) => {
            dispatch(followAC(userId));
        },
        unfollow: (userId:any) => {
            dispatch(unfollowAC(userId));
        },
        setUsers: (users:any) => {
            dispatch(setUsersAC(users));
        },
    }
}

const ProfileContainer: any = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default ProfileContainer;