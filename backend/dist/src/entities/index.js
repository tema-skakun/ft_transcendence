"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const user_entity_1 = require("./user/user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_entity_1.User; } });
const archivments_entity_1 = require("./archivements/archivments.entity");
const channel_entity_1 = require("./channel/channel.entity");
const matchHistoryEntry_entity_1 = require("./matchHistoryEntry/matchHistoryEntry.entity");
const message_entity_1 = require("./message/message.entity");
const entities = [user_entity_1.User, matchHistoryEntry_entity_1.MatchHistoryEntry, archivments_entity_1.Archivements, channel_entity_1.Channel, message_entity_1.Message];
exports.default = entities;
//# sourceMappingURL=index.js.map