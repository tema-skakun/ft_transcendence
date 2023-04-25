import {connect} from "react-redux";
import Profile from "./Profile";

let mapStateToProps = (state: any) => {
    return {
        profilePage: state.profilePage
    }
}
let mapDispatchToProps = (dispatch: any) => {
    return {}
}

const ProfileContainer: any = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default ProfileContainer;