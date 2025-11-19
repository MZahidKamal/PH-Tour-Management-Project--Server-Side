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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const envConfig_1 = __importDefault(require("./envConfig"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, doneFunction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // First try find and fetch the user from the database
        const userFromDatabase = yield user_model_1.default.findOne({ email: email });
        if (!userFromDatabase) {
            // If the user is not found in the database, then return null and redirect to sign up
            return doneFunction(null, false, { message: 'User not found! Please sign up.' });
        }
        if (userFromDatabase.isDeleted) {
            // If the user is deleted, then return null and redirect to sign up
            return doneFunction(null, false, { message: 'User is deleted! Please sign up.' });
        }
        if (userFromDatabase.isActive === user_interface_1.IsActiveEnum.INACTIVE || userFromDatabase.isActive === user_interface_1.IsActiveEnum.BLOCKED) {
            // If the user is inactive or blocked, then return null and redirect to sign up
            return doneFunction(null, false, { message: 'User is inactive or blocked! Contact support.' });
        }
        if (!userFromDatabase.isVerified) {
            // If the user is not verified, then return null and redirect to sign up
            return doneFunction(null, false, { message: 'User is not verified! Please verify your email.' });
        }
        // The user is found in the database, so check if the user is authenticated by credentials or not
        const isUserCredentialsAuthenticated = (_a = userFromDatabase.auths) === null || _a === void 0 ? void 0 : _a.some(authObj => authObj.provider === 'credentials');
        if (!isUserCredentialsAuthenticated && !userFromDatabase.password) {
            // If the user is not authenticated by credentials, then check if the user is authenticated by google or not
            const isUserGoogleAuthenticated = (_b = userFromDatabase.auths) === null || _b === void 0 ? void 0 : _b.some(authObj => authObj.provider === 'google');
            if (isUserGoogleAuthenticated) {
                // If the user is authenticated by google, then return null and redirect to sign in by google
                return doneFunction(null, false, { message: 'User is authenticated by Google! Please sign in by Google and then set your password.' });
            }
            // If the user is not authenticated by google, then return null and redirect to sign in
            return doneFunction(null, false, { message: 'User is not yet registered! Please sign up first.' });
        }
        // If the user is found in the database, then check if the password provided is correct or not
        const isPasswordValid = yield bcryptjs_1.default.compare(password, userFromDatabase.password);
        if (!isPasswordValid) {
            // If the password is not valid, then return null and redirect to sign in
            return doneFunction(null, false, { message: 'Password does not match! Please try again.' });
        }
        // If the password is valid, then return the user
        return doneFunction(null, userFromDatabase, { message: 'User logged in successfully!' });
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('CredentialsStrategy Error: ', error);
        return doneFunction(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: envConfig_1.default.google_client_id,
    clientSecret: envConfig_1.default.google_client_secret,
    callbackURL: envConfig_1.default.google_callback_url
}, (accessToken, refreshToken, profile, doneFunction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Let's see the profile object pattern coming from google (saved in a comment below)
        // console.log('Profile from Google OAuth Strategy: ', profile);
        // First find out the email from the google given profile
        const userEmailFromGoogle = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        // Then find and fetch the user from the database
        const userFromDatabase = yield user_model_1.default.findOne({ email: userEmailFromGoogle });
        if (userFromDatabase) {
            // If the user is found in the database, then return the user
            return doneFunction(null, userFromDatabase);
        }
        else {
            // If the user is not found in the database, then create a new user
            const newUserCreatedFromGoogleStrategy = yield user_model_1.default.create({
                name: profile.displayName,
                email: userEmailFromGoogle,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.RoleEnum.USER,
                auths: [{ provider: 'google', providerId: userEmailFromGoogle }],
                isVerified: true
            });
            return doneFunction(null, newUserCreatedFromGoogleStrategy);
        }
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('Google OAuth Strategy Error: ', error);
        return doneFunction(error);
    }
})));
/* frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token
Bridge == Google -> user db store -> token
Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access */
passport_1.default.serializeUser((userFromGoogleStrategy, done) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('userFromGoogleStrategy from serializeUser: ', userFromGoogleStrategy);
    const userId = userFromGoogleStrategy._id;
    done(null, userId);
}));
/*
1. **`serializeUser`**:
    - This function determines which data from the userFromGoogleStrategy object should be stored in the session
    - It takes a userFromGoogleStrategy object and a `done` callback function ()
    - It stores only the userFromGoogleStrategy's `_id` in the session, not the entire user object
    - The first parameter of `done(null, user._id)` is for errors (null means no error)
    - The second parameter is the data to be stored in the session (the user ID)
*/
passport_1.default.deserializeUser((userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFromDatabase = yield user_model_1.default.findById(userId);
        // console.log('userFromDatabase from deserializeUser: ', userFromDatabase);
        done(null, userFromDatabase);
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('Error in Deserializing the User: ', error);
        done(error);
    }
}));
/*
1. **`deserializeUser`**:
    - This function runs on every request when there's an authenticated session
    - It takes the stored userId from the session and a callback function
    - It retrieves the complete user object from MongoDB using `UserModel.findById()`
    - If successful, it calls `done(null, userFromDatabase)` to attach the user object to `req.user`
    - Previously we stored the user into req.user manually using `req.user = userFromDatabase`, but now passport does this automatically
    - If there's an error, it logs it and passes the error to `done(error)`
*/
/* This is the actual Profile Object which is directly coming from Google :-
 {
  id: '115737667591879907690',
  displayName: 'Alice Johnson',
  name: { familyName: undefined, givenName: 'Alice Johnson' },
  emails: [ { value: 'alice.johnson.testemail@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/ACg8ocJkve9tX6hCl8oocSeOhs3wqZVKlX-OcLYjNKR-S72hJp-CKw=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "115737667591879907690",\n' +
    '  "name": "Alice Johnson",\n' +
    '  "given_name": "Alice Johnson",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocJkve9tX6hCl8oocSeOhs3wqZVKlX-OcLYjNKR-S72hJp-CKw\\u003ds96-c",\n' +
    '  "email": "alice.johnson.testemail@gmail.com",\n' +
    '  "email_verified": true\n' +
    '}',
  _json: {
    sub: '115737667591879907690',
    name: 'Alice Johnson',
    given_name: 'Alice Johnson',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocJkve9tX6hCl8oocSeOhs3wqZVKlX-OcLYjNKR-S72hJp-CKw=s96-c',
    email: 'alice.johnson.testemail@gmail.com',
    email_verified: true
  }
}
*/
