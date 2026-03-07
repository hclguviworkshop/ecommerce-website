const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const env = require('./env');
const { User } = require('../models');

// JWT Strategy
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt.secret,
  },
  async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id, {
        attributes: { exclude: ['password'] },
      });
      if (!user || !user.isActive) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Google OAuth Strategy
if (env.google.clientId && env.google.clientSecret) {
  passport.use(new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // Check if email already exists
          user = await User.findOne({ where: { email: profile.emails[0].value } });
          if (user) {
            await user.update({ googleId: profile.id });
          } else {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
}

module.exports = passport;