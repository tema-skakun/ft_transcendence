"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LB = void 0;
const common_1 = require("@nestjs/common");
let LB = class LB {
    maps = [];
    initalize(numberOfProperties) {
        for (let cnt = 0; cnt < numberOfProperties; ++cnt) {
            this.maps.push(new Map());
        }
    }
    link(objectsToLinkBack, linkTo) {
        let cnt = 0;
        for (const object of objectsToLinkBack) {
            console.log(`setting ${cnt} from: ${JSON.stringify(object)} to: ${linkTo} `);
            this.maps[cnt].set(object, linkTo);
            ++cnt;
        }
    }
    retrieveMap(index) {
        return (this.maps[index]);
    }
};
LB = __decorate([
    (0, common_1.Injectable)()
], LB);
exports.LB = LB;
//# sourceMappingURL=LinkBack.js.map