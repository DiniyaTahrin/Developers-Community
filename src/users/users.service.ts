import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    await user.save();

    this.logger.log(`User created: ${user.email}`);
    return user;
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec(); // find user by email
  }
}
