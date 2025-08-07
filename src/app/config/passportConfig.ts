import passport from 'passport';
import {Profile, Strategy as GoogleStrategy, VerifyCallback} from 'passport-google-oauth20';
import envConfig from "./envConfig";
import UserModel from "../modules/user/user.model";
import {RoleEnum, UserInterface} from "../modules/user/user.interface";
import {Types} from "mongoose";
import {Strategy as CredentialsStrategy} from "passport-local";
import bcrypt from "bcryptjs";





passport.use(new CredentialsStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email: string, password: string, doneFunction) => {
        try {
            // First try find and fetch the user from the database
            const userFromDatabase = await UserModel.findOne({email: email}) as Partial<UserInterface>;

            if (!userFromDatabase) {
                // If the user is not found in the database, then return null and redirect to sign up
                return doneFunction(null, false, {message: 'User not found! Please sign up.'});
            }

            // The user is found in the database, so check if the user is authenticated by credentials or not
            const isUserCredentialsAuthenticated = userFromDatabase.auths?.some(authObj => authObj.provider === 'credentials') as boolean;

            if (!isUserCredentialsAuthenticated && !userFromDatabase.password) {

                // If the user is not authenticated by credentials, then check if the user is authenticated by google or not
                const isUserGoogleAuthenticated = userFromDatabase.auths?.some(authObj => authObj.provider === 'google') as boolean;

                if (isUserGoogleAuthenticated) {
                    // If the user is authenticated by google, then return null and redirect to sign in by google
                    return doneFunction(null, false, {message: 'User is authenticated by Google! Please sign in by Google and then set your password.'});
                }

                // If the user is not authenticated by google, then return null and redirect to sign in
                return doneFunction(null, false, {message: 'User is not yet registered! Please sign up first.'});
            }

            // If the user is found in the database, then check if the password provided is correct or not
            const isPasswordValid = await bcrypt.compare(password, userFromDatabase.password as string) as boolean;
            if (!isPasswordValid) {
                // If the password is not valid, then return null and redirect to sign in
                return doneFunction(null, false, {message: 'Password does not match! Please try again.'});
            }

            // If the password is valid, then return the user
            return doneFunction(null, userFromDatabase, {message: 'User logged in successfully!'});

        } catch (error) {
            /* eslint-disable-next-line no-console */
            console.log('CredentialsStrategy Error: ', error);
            return doneFunction(error);
        }
    })
)





passport.use(new GoogleStrategy({
        clientID: envConfig.google_client_id,
        clientSecret: envConfig.google_client_secret,
        callbackURL: envConfig.google_callback_url
    },
    async (accessToken: string, refreshToken: string, profile: Profile, doneFunction: VerifyCallback) => {
        try {
            // Let's see the profile object pattern coming from google (saved in a comment below)
            // console.log('Profile from Google OAuth Strategy: ', profile);

            // First find out the email from the google given profile
            const userEmailFromGoogle: string = profile.emails?.[0].value as string;

            // Then find and fetch the user from the database
            const userFromDatabase = await UserModel.findOne({email: userEmailFromGoogle}) as Partial<UserInterface>;

            if (userFromDatabase) {
                // If the user is found in the database, then return the user
                return doneFunction(null, userFromDatabase);
            }
            else {
                // If the user is not found in the database, then create a new user
                const newUserCreatedFromGoogleStrategy = await UserModel.create({
                    name: profile.displayName as string,
                    email: userEmailFromGoogle as string,
                    picture: profile.photos?.[0].value as string,
                    role: RoleEnum.USER,
                    auths: [{provider: 'google', providerId : userEmailFromGoogle as string}],
                    isVerified: true
                }) as Partial<UserInterface>;
                return doneFunction(null, newUserCreatedFromGoogleStrategy);
            }
        }
        catch (error) {
            /* eslint-disable-next-line no-console */
            console.log('Google OAuth Strategy Error: ', error);
            return doneFunction(error);
        }
    }
));
/* frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token
Bridge == Google -> user db store -> token
Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access */





passport.serializeUser(
    async (userFromGoogleStrategy: Partial<UserInterface>, done: (error: Error | null, userId?: Types.ObjectId) => void) => {
        // console.log('userFromGoogleStrategy from serializeUser: ', userFromGoogleStrategy);
        const userId = userFromGoogleStrategy._id as Types.ObjectId;
        done(null, userId);
    });
/*
1. **`serializeUser`**:
    - This function determines which data from the userFromGoogleStrategy object should be stored in the session
    - It takes a userFromGoogleStrategy object and a `done` callback function ()
    - It stores only the userFromGoogleStrategy's `_id` in the session, not the entire user object
    - The first parameter of `done(null, user._id)` is for errors (null means no error)
    - The second parameter is the data to be stored in the session (the user ID)
*/





passport.deserializeUser(async (
    userId: Types.ObjectId, done: (error: Error | null, user?: Partial<UserInterface>) => void) => {
    try {
        const userFromDatabase = await UserModel.findById(userId) as Partial<UserInterface>;
        // console.log('userFromDatabase from deserializeUser: ', userFromDatabase);
        done(null, userFromDatabase);
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.log('Error in Deserializing the User: ', error);
        done(error as Error);
    }
});
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
