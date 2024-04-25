import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { MESSAGES, REGEX } from '../../utils';

export class SignUpDto {
  @ApiProperty({
    description: 'The first name of the User',
    example: 'Jhon',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the User',
    example: 'Doe',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the User',
    example: 'jhon.doe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Password@123',
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'The role of the User',
    example: 'User',
  })
  @IsOptional()
  role?: string;
}
