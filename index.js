const express = require("express");
const app = express();
const passport = require("passport");
const session = require('express-session')

require("./auth.js");

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  //if true it will only set the cookies when the website is running on https
  }))

app.use(passport.initialize());
app.use(passport.session());
function isloggedin(req, res, next){
    req.user?next():res.sendStatus(401);
}

app.get("/", (req, res)=>{
    res.send("<a href='/auth/google'>sign in with google (for freely getting hacked :) )</a>");
})
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/failure'
}));

app.get("/auth/failure", (req, res)=>{
    res.sendStatus(404);
})


app.get("/auth/protected", isloggedin, (req, res)=>{
    const user = req.user.displayName;
    console.log(req.user);
    res.send(`hi ${user}`);
});

app.get("/auth/logout", (req, res)=>{
    req.session.destroy();
    res.send("see you again");
});



app.listen(5000, ()=>{
    console.log("server is running in port",5000);
});