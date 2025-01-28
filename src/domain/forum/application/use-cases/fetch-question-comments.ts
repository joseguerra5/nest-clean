import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objecs/comment-with-author'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseReponse = Either<null, {
  comments: CommentWithAuthor[]
}>

@Injectable()
export class FetchQuestionCommentsUseCase {
  // dependencias
  constructor(private questionsCommentsRepository: QuestionsCommentsRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    page,
    questionId
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseReponse> {
    const comments = await this.questionsCommentsRepository.findManyByQuestionIdWithAutor(questionId, { page })

    return right({
      comments
    })
  }
}
