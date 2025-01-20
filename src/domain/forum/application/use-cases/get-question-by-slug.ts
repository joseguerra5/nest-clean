import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseReponse = Either<ResouceNotFoundError, {
  question: Question
}>

@Injectable()
export class GetQuestionBySlugUseCase {
  // dependencias
  constructor(private questionsRepository: QuestionsRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    slug
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseReponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    return right({
      question
    })
  }
}
