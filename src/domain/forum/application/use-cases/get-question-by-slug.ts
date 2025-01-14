import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseReponse = Either<ResouceNotFoundError, {
  question: Question
}>

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
