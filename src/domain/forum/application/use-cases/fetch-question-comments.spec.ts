import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Get answers by question Id', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })
  it('should be able to fetch recent answers', async () => {
    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01") }))
    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01") }))
    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01") }))

    const result = await sut.execute({
      questionId: "question-01",
      page: 1
    })

    expect(result.value?.questionsComments).toHaveLength(3)
  })

  it('should be able to fetch paginated recent answers', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01") }))
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2
    })
    expect(result.value?.questionsComments).toHaveLength(2)
  })
})
