import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}

type FetchRecentQuestionUseCaseReponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionUseCase {
  // dependencias
  constructor(private questionsRepository: QuestionsRepository) {}
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseReponse> {
    const questions = await this.questionsRepository.findManyRecents({ page })

    return right({
      questions,
    })
  }
}
