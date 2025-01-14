import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { FetchQuestionAnswerUseCase } from './fetch-question-answers'

let inMemoryAnswersRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswerUseCase

describe('Get answers by question Id', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswerRepository()
    sut = new FetchQuestionAnswerUseCase(inMemoryAnswersRepository)
  })
  it('should be able to fetch recent answers', async () => {
    await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityId("question-01") }))
    await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityId("question-01") }))
    await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityId("question-01") }))

    const result = await sut.execute({
      questionId: "question-01",
      page: 1
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated recent answers', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityId("question-01") }))
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2
    })
    expect(result.value?.answers).toHaveLength(2)
  })
})
