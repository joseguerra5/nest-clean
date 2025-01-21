import {
  BadRequestException, Controller, Delete, HttpCode, Param
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/:id/comments')
export class DeleteCommentOnAnswerController {
  constructor(
    private deleteAnswerComment: DeleteAnswerCommentUseCase,
  ) { }
  @Delete()
  @HttpCode(200)
  async handle(
    @Param("id") commentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId: commentId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
