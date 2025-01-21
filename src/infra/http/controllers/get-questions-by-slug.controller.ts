import {
  BadRequestException, Controller, Get, Param, UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { QuestionPresenter } from '../presenters/question-presenter'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

@Controller('/questions/:slug')
@UseGuards(AuthGuard("jwt"))
export class GetQuestionBySlugsController {
  constructor(
    private getQuestionBySlug: GetQuestionBySlugUseCase,
  ) { }
  @Get()
  async handle(
    @Param("slug") slug: string
  ) {
    const result = await this.getQuestionBySlug.execute({
      slug
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      question: QuestionPresenter.toHTTP(result.value.question)
    }
  }
}
