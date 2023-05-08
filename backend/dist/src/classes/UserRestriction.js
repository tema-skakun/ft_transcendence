"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserRestriction_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRestriction = void 0;
const common_1 = require("@nestjs/common");
const restrictionMap = (Map);
let UserRestriction = UserRestriction_1 = class UserRestriction {
    static user_can_press_keys_in_game_canvas = "user_can_press_keys_in_game_canvas";
    restrictions;
    nested;
    constructor() {
        this.nested = [];
        this.restrictions = new restrictionMap;
        for (const stuff in UserRestriction_1) {
            this.restrictions.set(stuff, new Map);
        }
    }
    switch(on, userId, action, props = undefined) {
        if (!this.restrictions.has(action))
            throw Error('Action does not exists');
        else if (!this.restrictions.get(action).has(userId)) {
            console.log(`Notice: state switch was not yet attached to ${userId}`);
            return;
        }
        if (on === this.restrictions.get(action).get(userId).state) {
            console.log(on);
            console.log('this way');
            return;
        }
        if (!props)
            this.restrictions.get(action).get(userId).stateChange(on, userId);
        else
            this.restrictions.get(action).get(userId).stateChange(on, userId, props);
    }
    attachStateSwitch(userId, action, stateSwitch, initalState = true) {
        if (!this.restrictions.has(action))
            throw Error('Action does not exist');
        this.restrictions.set(action, this.restrictions.get(action).set(userId, { state: initalState, stateChange: stateSwitch }));
    }
};
UserRestriction = UserRestriction_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UserRestriction);
exports.UserRestriction = UserRestriction;
//# sourceMappingURL=UserRestriction.js.map