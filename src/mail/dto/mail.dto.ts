import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MailDto {
  @ApiProperty({
    description: 'The recipient',
    example: 'recipient@gmail.com',
  })
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Mail Subject',
    example: `Please confirm otp`,
  })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Body of te mail',
    example: '<p>Confirm the otp</p>',
  })
  @IsNotEmpty()
  html: string;
}
