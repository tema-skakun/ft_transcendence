// import axios from "axios";
// import React from "react";
// import JSCookies from 'js-cookie';

// const BACKEND_ADDR: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969`;

// const URL_FOR_HISTORY: string = BACKEND_ADDR + '/match-history/';

// type HistoryDto = {
// 	intra_id: number;
// 	username: string;
// 	picture_url?: string
// };

// class MatchHistory extends React.Component<any, any> {
//     componentDidMount() {
// 		axios.get(URL_FOR_HISTORY)
// 			.then((response: any) => {
// 				this.props.setEntries(response.data);
// 			})
//     }

//     render() {
//         return (
//             <div>
//                 {
//                     this.props.profilePage.users.map((u: FriendDto) => <div key={u.id}>
//                             <span>
//                                 <div>
//                                     <img
//                                         src={u.pictureUrl != null ? u.pictureUrl : defaultAvatar}
//                                         alt="Avatar User"
//                                     />
//                                 </div>
//                                 <div>
//                                         <button onClick={() => unfriend(u.id)}>Unfriend</button>
//                                 </div>
//                             </span>
//                         <span>
//                                 <span>
//                                     <div>{u.name}</div>
//                                     <div>{u.status}</div>
//                                 </span>
//                             </span>
//                     </div>)
//                 }
//             </div>
//         )
//     }
// }

// export default Friends

export class dummy{}