import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from '../user/dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { MailDto } from '../mail/dto';
import { UserRoles } from 'src/user/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName } = signUpDto;
    const code = Math.random().toString().slice(-6);
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

    const emailContent = `
    <div style="font-family: 'Arial', sans-serif;">
      <p>Hey ${firstName},</p>
      <p>Your OTP is: ${code}</p>
    </div>
  `;

    const mailDto: MailDto = {
      to: email,
      subject: 'Please confirm OTP',
      html: emailContent,
    };

    await this.mailService.sendEmail(mailDto);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      role: UserRoles.MEMBER,
      password: hashedPassword,
      otp: code,
      otpExpiration: otpExpiration,
    });

    const isConfirmed = await this.confirmOtp(email, code);

    if (!isConfirmed) {
      await this.userModel.deleteOne({ _id: user._id });
      throw new UnauthorizedException('OTP yet to be confirmed');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { user, token };
  }

  async signin(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  async confirmOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    console.log(user);
    if (!user || user.otp !== otp || user.otpExpiration < new Date()) {
      return false;
    }
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    return true;
  }
}
