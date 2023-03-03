import * as common from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

@ApiTags('Auth')
@common.Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @common.SerializeOptions({
    groups: ['me'],
  })
  
  @common.Post('email/login')
  @common.HttpCode(common.HttpStatus.OK)
  public async login(@common.Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, false);
  }
}
