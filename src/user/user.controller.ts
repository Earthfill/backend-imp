import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { User } from './entities';
import { UserDto } from './dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@ApiTags('User')
@Controller('user')
export class UserController {
  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: User,
  })
  profile(@CurrentUser() user: User) {
    return user;
  }
}
