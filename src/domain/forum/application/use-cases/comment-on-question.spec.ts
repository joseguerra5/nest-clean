import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Create a question comment', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionCommentRepository, inMemoryQuestionRepository)
  })
  it('should be able create a question comment', async () => {
    await inMemoryQuestionRepository.create(makeQuestion({ authorId: new UniqueEntityId("author-01") }))

    const result = await sut.execute({
      authorId: "author-01",
      content: "example-01",
      questionId: inMemoryQuestionRepository.items[0].id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionCommentRepository.items[0]).toEqual(result.value?.questionComment)
  })
})
