import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../user/dto';
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
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  async signup(@Body() signupDto: SignUpDto): Promise<{ token: string }> {
    return await this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SignInDto): Promise<{ token: string }> {
    return await this.authService.signin(signinDto);
  }
}
