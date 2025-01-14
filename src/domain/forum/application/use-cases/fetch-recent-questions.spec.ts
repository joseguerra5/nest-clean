import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestionUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(makeQuestion({ createdAt: new Date(2024, 11, 12) }))
    await inMemoryQuestionRepository.create(makeQuestion({ createdAt: new Date(2024, 11, 20) }))
    await inMemoryQuestionRepository.create(makeQuestion({ createdAt: new Date(2024, 11, 13) }))

    const result = await sut.execute({
      page: 1
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 13) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 12) })
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(makeQuestion({ createdAt: new Date(2024, 11, i) }))
    }

    const result = await sut.execute({
      page: 2
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 2) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 1) }),
    ])
  })
})
