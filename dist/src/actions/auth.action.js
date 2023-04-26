"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAction = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const http_errors_1 = __importDefault(require("http-errors"));
const helpers_1 = require("../helpers");
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const auth_role_1 = require("@hellocacbantre/auth-role");
const generateReferralCode = (context) => {
    const { getModel } = (0, db_schemas_1.createConnect)(context.mongodb);
    const User = getModel('User');
    return () => __awaiter(void 0, void 0, void 0, function* () {
        const referralCode = (0, helpers_1.generateCode)();
        const isReferralCode = yield User.exists({ referralCode });
        if (isReferralCode)
            return generateReferralCode(context)();
        else
            return referralCode;
    });
};
class AuthAction {
    constructor(context) {
        this.jwtService = new auth_role_1.JwtService(context);
    }
    signUp(context) {
        const { getModel } = (0, db_schemas_1.createConnect)(context.mongodb);
        const User = getModel('User');
        return (payload) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName, inviteCode } = payload;
            const isConflict = yield User.exists({ email });
            if (isConflict)
                throw http_errors_1.default.Conflict(`${email} is already`);
            // generate referral code
            const referralCode = yield generateReferralCode(context)();
            const data = {
                firstName,
                lastName,
                email,
                password,
                referralCode,
                inviteCode: ''
            };
            const isInviteCode = yield User.exists({ referralCode: inviteCode });
            if (isInviteCode)
                data.inviteCode = inviteCode;
            // Create a new user
            const newUser = new User(data);
            yield newUser.save();
            const { _id } = newUser;
            // generate token
            const [token, refreshToken] = yield bluebird_1.default.all([
                this.jwtService.generateAccessToken({ _id }),
                this.jwtService.generateRefreshToken({ _id })
            ]);
            return { token, refreshToken, newUser };
        });
    }
    signIn(context) {
        const { getModel } = (0, db_schemas_1.createConnect)(context.mongodb);
        const User = getModel('User');
        return (payload) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield User.findOne({ email });
            if (!user)
                throw http_errors_1.default.UnprocessableEntity(`${email} invalid`);
            const { status, _id } = user;
            if (status === 'banned')
                throw http_errors_1.default.Forbidden('Account banned');
            const isCorrectPassword = yield user.isValidPassword(password);
            if (!isCorrectPassword)
                throw http_errors_1.default.Unauthorized('password invalid');
            // generate token
            const [token, refreshToken] = yield bluebird_1.default.all([
                this.jwtService.generateAccessToken({ _id }),
                this.jwtService.generateRefreshToken({ _id })
            ]);
            return { token, refreshToken, user };
        });
    }
}
exports.AuthAction = AuthAction;
