import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository"
import { AnswerQuestionUseCase } from "./answer-question"

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Create a answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })
  it('should be able create a answer', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      instructorId: '01',
      questionId: '01',
      attachmentsIds: []
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
  })
})
