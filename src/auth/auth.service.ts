// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserLoginDto } from '../users/dto/users.dto';
import { sendVerificationEmail } from '../utils/email.utility'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Inject Repository<User>
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      if (!user.e_verified) {
        throw new UnauthorizedException('User is not verified. Please check your email for verification instructions.');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from Google';
    }
    const user = await this.usersService.findOrCreate({
      email: req.user.user.email,
      firstName: req.user.user.firstName,
      lastName: req.user.user.lastName,
      birthday: req.user.user.birthday,
      origin: "google",
      e_verified: true
    });

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const user = await this.usersService.findOrCreate(userData);
    if (!user.e_verified) {
      // Send verification email
      await sendVerificationEmail(user.email, user.verificationToken);
    }
    return {
      message: 'Registration successful. Please check your email for verification instructions.',
    };
  }



  


  async verifyEmail(token: string) {

    const user = await this.usersService.findOneByVerificationToken(token);

    if (!user) {
      throw new Error('Invalid verification token.');
    }

    user.e_verified = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async login(UserLoginDto: UserLoginDto) {
    const { email, password } = UserLoginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found.'); // User not found
    }

    if (!user.e_verified) {
      throw new UnauthorizedException('User is not verified. Please check your email for verification instructions.');
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate and return JWT
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id
    };
  }

}
