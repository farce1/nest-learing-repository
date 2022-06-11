import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          // hardcoded for now
          url: 'postgresql://postgres:dev123@localhost:5434/nest?schema=public',
        },
      },
    })
  }
}
