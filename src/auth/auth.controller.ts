import { Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // auth/signup
  @Post('signup')
  signup() {
    Logger.log('called signup')

    return this.authService.signup()
  }

  // auth/signin
  @Post('signin')
  signin() {
    Logger.log('called signin')

    return this.authService.signin()
  }
}
