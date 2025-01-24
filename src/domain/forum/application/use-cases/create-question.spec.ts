import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('Create a question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentsRepository)
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

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      authorId: '01',
      title: 'Nova pergunta',
      attachmentsIds: ["1", "2"]
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items[0]).toHaveLength(2)
  })
})
