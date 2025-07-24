"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleEnum = exports.IsActiveEnum = void 0;
var IsActiveEnum;
(function (IsActiveEnum) {
    IsActiveEnum["ACTIVE"] = "ACTIVE";
    IsActiveEnum["INACTIVE"] = "INACTIVE";
    IsActiveEnum["BLOCKED"] = "BLOCKED";
})(IsActiveEnum || (exports.IsActiveEnum = IsActiveEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["SUPER_ADMIN"] = "SUPER_ADMIN";
    RoleEnum["ADMIN"] = "ADMIN";
    RoleEnum["USER"] = "USER";
    RoleEnum["GUIDE"] = "GUIDE";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
/*
* Some warnings are coming from the IDE regarding the fields in the enums, saying these are unused and readonly.
* There are not from TypeScript, but from the IDE, so we can avoid these warnings.
*/
