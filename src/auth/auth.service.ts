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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, firstName, lastName, role } = signUpDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ id: user._id });
    return { token };
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
}
