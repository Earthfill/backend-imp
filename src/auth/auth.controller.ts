import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmOtpDto, SignInDto, SignUpDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Created user object and token as response',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  async signup(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ user: User; token: string }> {
    return await this.authService.signup(signUpDto);
  }

  @Post('signin')
  @ApiCreatedResponse({
    description: 'Generated token as response',
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async signin(@Body() signinDto: SignInDto): Promise<{ token: string }> {
    return await this.authService.signin(signinDto);
  }

  @Post('confirmotp')
  @ApiCreatedResponse({
    description: 'Generated token as response',
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Invalid OTP' })
  async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto): Promise<boolean> {
    const { email, otp } = confirmOtpDto;
    return await this.authService.confirmOtp(email, otp);
  }
}
