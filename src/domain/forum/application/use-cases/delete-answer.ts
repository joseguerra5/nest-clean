import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answer-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'


interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseReponse = Either<NotAllowedError | ResouceNotFoundError, {}>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) { }
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseReponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResouceNotFoundError())
      throw new Error("Answer not found")
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())

      throw new Error("Not alowed")
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
