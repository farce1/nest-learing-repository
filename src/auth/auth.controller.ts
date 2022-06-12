import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // auth/signup
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    Logger.log('called signup')

    return this.authService.signup(dto)
  }

  // auth/signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    Logger.log('called signin')

    return this.authService.signin(dto)
  }
}
