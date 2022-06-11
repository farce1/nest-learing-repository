import { Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // auth/signup
  @Post('signup')
  signup() {
    return 'I am signed up'
  }

  // auth/signin
  @Post('signin')
  signin() {
    return 'I am signin in'
  }
}
