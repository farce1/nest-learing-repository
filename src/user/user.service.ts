import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      }
    })

    delete user.hash

    return user
  }
}
