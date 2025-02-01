import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let attachmentsRepository: InMemoryAttachmentRepository
let studentRepository: InMemoryStudentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Create a question comment', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    attachmentsRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      attachmentsRepository,
      studentRepository,
    )
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      studentRepository,
    )
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionCommentRepository,
      inMemoryQuestionRepository,
    )
  })
  it('should be able create a question comment', async () => {
    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      content: 'example-01',
      questionId: question.id.toString(),
    })
    expect(result.isRight()).toBe(true)

    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      'example-01',
    )
  })
})
