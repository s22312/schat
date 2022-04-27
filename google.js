const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const clientId = process.env.GO_ClientId;
const clientSecret = process.env.GO_ClientSecret;
const callbackUrl = "https://schat.xthe.org/login/google_oauth";

passport.serializeUser((user, done) => {
    done(null, { id: user.id, name: user.name});
});

passport.deserializeUser((user, done) => {
    done(null, { id: user.id, name: user.name});
});

passport.use(new GoogleStrategy({
    clientID: clientId, clientSecret: clientSecret, callbackURL: callbackUrl
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, { id: profile.id, name: profile.displayName }));
}));

module.exports = app => {
    app.use(
        session({
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/login", passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/userinfo.profile"]
    }));

    app.get("/login/google_oauth", passport.authenticate("google", {
        failureRedirect: "/login/failed",
        session: true
    }), (req, res) => {
        res.redirect("/");
    });
};