import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserRoles } from '../../user/enums';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private usersService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.usersService.findById(id);
      return user.role === UserRoles.ADMIN;
    }

    return false;
  }
}
