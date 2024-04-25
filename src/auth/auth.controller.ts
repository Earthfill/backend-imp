import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../user/dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/entities';
import { CurrentUser } from './decorators';
import { JwtAuthGuard } from './guards';

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/profile')
  // @Roles(Role.USER)
  profile(@CurrentUser() user: User) {
    return user;
  }
}
