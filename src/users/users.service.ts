import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/users.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<any> {
    return this.usersRepository.findOneBy({ email });
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async findOneByVerificationToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { verificationToken: token } });
  }
  
  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.findOneByEmail(createUserDto.email);
    if (!user) {
      // if user is coming from normal registration process (email/password)
      if (createUserDto.origin != "google" && createUserDto.password) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash the password with a salt round of 10
        user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
      } else {
        //when user is registring through google
        user = this.usersRepository.create(createUserDto);
      }
      user = await this.usersRepository.save(user);
    }
    return user; // Return user object
  }

}