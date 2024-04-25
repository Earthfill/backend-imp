import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      if (!profile || !profile.emails || !profile.emails[0] || !profile.name) {
        throw new Error('Invalid profile data received from Google OAuth');
      }
      const { emails, name } = profile;
      const user = {
        email: emails[0].value,
        firstName: name.givenName || '',
        lastName: name.familyName || '',
        accessToken,
        refreshToken,
      };
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth validation error:', error);
      return done(error, false);
    }
  }
}
