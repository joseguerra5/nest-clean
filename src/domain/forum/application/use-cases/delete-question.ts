import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseReponse = Either<NotAllowedError | ResouceNotFoundError, {}>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) { }
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseReponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right({})
  }
}
