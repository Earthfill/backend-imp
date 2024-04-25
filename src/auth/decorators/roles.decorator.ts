import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../user/enums';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
