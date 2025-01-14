import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repository'

interface FetchQuestionAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswerUseCaseReponse = Either<null, {
  answers: Answer[]
}>

export class FetchQuestionAnswerUseCase {
  // dependencias
  constructor(private answerRepository: AnswersRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    page,
    questionId
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseReponse> {
    const answers = await this.answerRepository.findManyByQuestiondId(questionId, { page })

    return right({
      answers
    })
  }
}
