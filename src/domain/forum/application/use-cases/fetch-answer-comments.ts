import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseReponse = Either<null,{
  answersComments: AnswerComment[]
}> 

export class FetchAnswerCommentsUseCase {
  // dependencias
  constructor(private answersCommentsRepository: AnswerCommentsRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    page,
    answerId
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseReponse> {
    const answersComments = await this.answersCommentsRepository.findManyByAnswerId(answerId, { page })

    return right({
      answersComments
    })
  }
}
