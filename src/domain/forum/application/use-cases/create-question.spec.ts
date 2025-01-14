import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('Create a question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able create a question', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      authorId: '01',
      title: 'Nova pergunta',
      attachmentsIds: ["1", "2"]
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
    expect(inMemoryQuestionRepository.items[0].attachments.currentItems).toHaveLength(2)
  })
})
