import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { APIFeatures } from '../common/utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string) {
    if (!email) {
      throw new NotFoundException('Email already exists');
    }
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number) {
    if (!id) {
      throw new NotFoundException('User already exists');
    }
    const user = await this.userModel.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(query?: any): Promise<User[]> {
    const features = new APIFeatures(this.userModel.find(), query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const users = await features.mongooseQuery;
    return users;
  }
}
