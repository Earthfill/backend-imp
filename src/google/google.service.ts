import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../user/entities';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRoles } from '../user/enums';

@Injectable()
export class GoogleService {
  private googleOAuth2Client: OAuth2Client;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    this.googleOAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    });
  }

  async authenticateUser(idToken: string): Promise<User> {
    try {
      const ticket = await this.googleOAuth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      let user = await this.userModel.findOne({ email: payload.email });

      if (!user) {
        user = await this.userModel.create({
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          role: UserRoles.MEMBER,
          isGoogleAuth: true,
        });
      }

      return user;
    } catch (error) {
      console.error('Failed to authenticate user with Google:', error);
      throw new Error('Failed to authenticate user with Google');
    }
  }
}
