import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/notifications/:notificationId/read')
@UseGuards(AuthGuard('jwt'))
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
