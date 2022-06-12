import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import { hash } from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup({ email, password }: AuthDto) {
    const hashedPassword = await hash(password)

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash: hashedPassword,
        },
      })

      return user
    } catch (error) {
      // return error about duplication
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken.')
      }

      throw error
    }
  }
  signin() {
    return { message: 'I have signed in' }
  }
}
