import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit a question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionRepository, inMemoryQuestionAttachmentRepository)
  })
  it('should be able to edit a question', async () => {

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-01")
    }, new UniqueEntityId("question-01"))

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "author-01",
      content: "example-01",
      title: "example-01",
      attachmentsIds: []
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: "example-01",
      title: "example-01",
    })
  })

  it('not should be able to edit a question with diferent authorId', async () => {

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-01")
    }, new UniqueEntityId("question-01"))

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "author-02",
      content: "example-01",
      title: "example-01",
      attachmentsIds: ["1", "2"]
    })
    expect(result.value).toBeInstanceOf(NotAllowedError)

  }),

  it('should sync new and removed attachments when editing a question', async () => {

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-01"),
    }, new UniqueEntityId("question-01"))

    await inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      })
    )

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "author-01",
      content: "example-01",
      title: "example-01",
      attachmentsIds: ["1", "3"]
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(expect.arrayContaining([
      expect.objectContaining({
        attachmentId: { value: "1" },
        questionId: { value: "question-01" }
      }),
      expect.objectContaining({
        attachmentId: { value: "3" },
        questionId: { value: "question-01" }
      })
    ]))
  })
})
