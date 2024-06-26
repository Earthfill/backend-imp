import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto, SignInDto, SignUpDto } from '../user/dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { MailDto } from '../mail/dto';
import { UserRoles } from '../user/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<User> {
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
      isVerified: false,
    });

    return user;
  }

  async signin(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('OTP has not been confirmed!');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = this.jwtService.sign({ id: user._id });
    const refreshToken = this.jwtService.sign({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const googleUser = req.user;
    let user = await this.userModel.findOne({ email: googleUser.email });

    if (!user) {
      user = await this.userModel.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        role: UserRoles.MEMBER,
        isGoogleAuth: true,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
      });
    }

    return user;
  }

  async confirmOtp(email: string, otp: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiration < new Date()) {
      throw new UnauthorizedException('Invalid OTP or OTP expired');
    }
    user.isVerified = true;
    await user.save();
    user.otp = undefined;
    user.otpExpiration = undefined;
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      const { refreshToken } = refreshTokenDto;
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const accessToken = this.jwtService.sign({ id: user._id });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
