import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'OTP provided by the user' })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'OTP secret associated with the user' })
  @IsNotEmpty()
  otpSecret: string;
}
