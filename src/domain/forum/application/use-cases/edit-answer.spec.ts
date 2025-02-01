import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('Edit a answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })
  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-01'),
        questionId: new UniqueEntityId('answer-01'),
      },
      new UniqueEntityId('answer-01'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
      content: 'example-01',
      attachmentsIds: [],
    })

    expect(inMemoryAnswerRepository.items).toHaveLength(1)
    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'example-01',
    })
  })

  it('not should be able to edit a answer with diferent authorId', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('answer-01'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-02',
      content: 'example-01',
      attachmentsIds: [],
    })
    expect(result.value).toBeInstanceOf(Error)
  })

  it('should sync new and removed attachments when editing a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('answer-01'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
      content: 'example-01',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: { value: '1' },
        }),
        expect.objectContaining({
          attachmentId: { value: '3' },
        }),
      ]),
    )
  })
})
