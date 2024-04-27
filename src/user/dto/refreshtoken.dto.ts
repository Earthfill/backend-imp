import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refresh token for the user' })
  @IsNotEmpty()
  refreshToken: string;
}
