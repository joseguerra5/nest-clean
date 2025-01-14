import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseReponse = Either<ResouceNotFoundError, {
  questionComment: QuestionComment
}>

export class CommentOnQuestionUseCase {
  // dependencias
  constructor(
    private questionsCommentsRepository: QuestionsCommentsRepository,
    private questionsRepository: QuestionsRepository,
  ) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    authorId,
    content,
    questionId
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseReponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
      throw new Error('Question not found')
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content
    })

    await this.questionsCommentsRepository.create(questionComment)

    return right({
      questionComment
    })
  }
}
