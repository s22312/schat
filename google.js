// https://nasubifx.hatenablog.com/entry/2021/01/09/022126

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const clientId = process.env.GO_ClientId;
const clientSecret = process.env.GO_ClientSecret;
const callbackUrl = "https://schat.xthe.org/login/google_oauth";

passport.serializeUser((user, done) => {
    done(null, { id: user.id, name: user.name, familyName: user.familyName, middleName: user.middleName, givenName: user.givenName, email: user.email, photo: user.photo });
});

passport.deserializeUser((user, done) => {
    done(null, { id: user.id, name: user.name, familyName: user.familyName, middleName: user.middleName, givenName: user.givenName, email: user.email, photo: user.photo });
});

passport.use(new GoogleStrategy({
    clientID: clientId, clientSecret: clientSecret, callbackURL: callbackUrl
}, (accessToken, refreshToken, profile, done) => {
    //console.dir(profile);
    process.nextTick(() => done(null, { id: profile.id, name: profile.displayName, familyName: profile.name.familyName, middleName: profile.name.middleName, givenName: profile.name.givenName, email: profile.emails[0].value, photo: profile.photos[0].value }));
}));

module.exports = {
    init: app => {
        app.use(
            session({
                secret: process.env.SECRET,
                resave: false,
                saveUninitialized: false
            })
        );
        app.use(passport.initialize());
        app.use(passport.session());
    
        app.get("/login", (req, res, next) => {
            req.session.destroy();
            req.logout();
            res.clearCookie("connect.sid");
            passport.authenticate("google", {
                scope: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email"
                ],
                accessType: "offline",
                prompt: "consent"
            })(req, res, next);
        });
    
        app.get("/login/google_oauth", passport.authenticate("google", {
            failureRedirect: "/login/failed",
            session: true
        }), (req, res) => {
            res.redirect("/home");
        });
    },
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        else res.redirect("/login");
    }
};