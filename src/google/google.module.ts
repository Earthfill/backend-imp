import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleStrategy } from '../auth/strategies';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  providers: [GoogleService, GoogleStrategy],
  exports: [GoogleService, GoogleStrategy],
})
export class GoogleModule {}
