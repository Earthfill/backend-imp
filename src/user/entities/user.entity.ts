import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserRoles } from '../enums';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({ description: 'First name', example: 'Jhon' })
  @Prop()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @Prop()
  lastName: string;

  @ApiProperty({ description: 'User name', example: 'jayDEE' })
  @Prop()
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'jhon.doe@gmail.com',
  })
  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @ApiProperty({ description: 'Hashed user password' })
  @Prop()
  password: string;

  @ApiProperty({
    description: 'The role of the User',
    enum: UserRoles,
  })
  @Prop({ enum: UserRoles, default: UserRoles.MEMBER })
  role?: UserRoles;

  @ApiProperty({ description: 'One-Time Password' })
  @Prop()
  otp: string;

  @ApiProperty({ description: 'OTP Expiration Time' })
  @Prop()
  otpExpiration: Date;

  @ApiProperty({ description: 'Check if account is verified' })
  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
