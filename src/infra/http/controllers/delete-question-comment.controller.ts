import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller('/questions/:id/comments')
export class DeleteCommentOnQuestionController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') commentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId: commentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
