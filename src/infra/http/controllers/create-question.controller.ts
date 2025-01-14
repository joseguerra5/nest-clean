import {
  Body,
  Controller, HttpCode, Post, UseGuards
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

export const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard("jwt"))
export class CreateQuestionController {
  constructor(
    private createQuestion: CreateQuestionUseCase,
    private jwt: JwtService
  ) { }
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {

    const { content, title } = body

    const userId = user.sub

    await this.createQuestion.execute({
      content,
      title,
      authorId: userId,
      attachmentsIds: []
    })
  }
}
