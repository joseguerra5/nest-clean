import {
  BadRequestException, Controller, Get, Param, Query, UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
@UseGuards(AuthGuard("jwt"))
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerComments: FetchAnswerCommentsUseCase,
  ) { }
  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answersComments = result.value.answersComments

    return {
      comments: answersComments.map(CommentPresenter.toHTTP)
    }
  }
}
