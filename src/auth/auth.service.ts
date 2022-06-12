import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import { hash, verify } from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup({ email, password }: AuthDto) {
    const hashedPassword = await hash(password)

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash: hashedPassword
        }
      })

      return this.signToken(user.id, user.email)
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
        email
      }
    })

    const error = new ForbiddenException('Credentials incorrect')

    if (!user) throw error

    const matchPassword = await verify(user.hash, password)

    if (!matchPassword) throw error

    return this.signToken(user.id, user.email)
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    }

    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret
    })

    return {
      access_token: token
    }
  }
}
