import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import { hash } from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup({ email, password }: AuthDto) {
    const hashedPassword = await hash(password)

    const user = await this.prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
      },
    })

    return user
  }
  signin() {
    return { message: 'I have signed in' }
  }
}
