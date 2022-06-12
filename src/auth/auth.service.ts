import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import { argon2d, hash, verify } from 'argon2'
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

      // for now not clean remove field
      delete user.hash

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
  async signin({ email, password }: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    const error = new ForbiddenException('Credentials incorrect')

    if (!user) throw error

    const matchPassword = await verify(user.hash, password)

    if (!matchPassword) throw error

    // for now not clean remove field
    delete user.hash

    return user
  }
}
