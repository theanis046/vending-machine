import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<{ token: string; user: User }> {
    const users = await this.usersService.findAll();
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    const isValidPassword = loginDto.password === user.password;

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

}
