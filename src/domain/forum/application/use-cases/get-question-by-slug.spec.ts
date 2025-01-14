import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })
  it('should be able get a question by slug', async () => {

    const newQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      slug: "example-question"
    })

    expect(result.isRight()).toBe(true)
  })
})
