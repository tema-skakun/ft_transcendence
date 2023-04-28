import { User } from "src/entities/user/user.entity";
import { Channel } from "./channel/channel.entity";
import { Message } from "./message/message.entity";

const entities = [User, Channel, Message];

export {User};
export default entities;