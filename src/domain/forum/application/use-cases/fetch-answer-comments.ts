import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objecs/comment-with-author'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseReponse = Either<null, {
  comments: CommentWithAuthor[]
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
  // dependencias
  constructor(private answersCommentsRepository: AnswerCommentsRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    page,
    answerId
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseReponse> {
    const comments = await this.answersCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page })

    return right({
      comments
    })
  }
}
