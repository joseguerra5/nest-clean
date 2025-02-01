import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: AnswerQuestionUseCase

describe('Create a answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })
  it('should be able create a answer', async () => {
    const result = await sut.execute({
      content: 'nova resposta',
      authorId: '01',
      questionId: '01',
      attachmentsIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      content: 'new answer',
      authorId: '01',
      attachmentsIds: ['1', '2'],
      questionId: '01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
  })
})
