import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/decorators'
import { JwtGuard } from 'src/auth/guard'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('id') id: number) {
    return this.userService.getMe(id)
  }
}
