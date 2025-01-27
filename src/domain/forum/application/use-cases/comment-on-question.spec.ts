import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Create a question comment', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionCommentRepository, inMemoryQuestionRepository)
  })
  it('should be able create a question comment', async () => {
    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      content: "example-01",
      questionId: question.id.toString()
    })
    expect(result.isRight()).toBe(true)
    
    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual("example-01")
  })
})
