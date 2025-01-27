import {
  BadRequestException,
  Body,
  Controller, HttpCode, Param, Put
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

export const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid())
})

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(
    private editQuestion: EditQuestionUseCase,
  ) { }
  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string
  ) {

    const { content, title, attachments } = body

    const userId = user.sub

    const result = await this.editQuestion.execute({
      content,
      title,
      authorId: userId,
      attachmentsIds: attachments,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
