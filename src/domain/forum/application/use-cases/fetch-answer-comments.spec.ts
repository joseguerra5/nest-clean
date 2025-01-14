import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Get answers by answer Id', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })
  it('should be able to fetch recent answers', async () => {
    await inMemoryAnswerCommentRepository.create(makeAnswerComment({ answerId: new UniqueEntityId("answer-01") }))
    await inMemoryAnswerCommentRepository.create(makeAnswerComment({ answerId: new UniqueEntityId("answer-01") }))
    await inMemoryAnswerCommentRepository.create(makeAnswerComment({ answerId: new UniqueEntityId("answer-01") }))

    const result = await sut.execute({
      answerId: "answer-01",
      page: 1
    })

    expect(result.value?.answersComments).toHaveLength(3)
  })

  it('should be able to fetch paginated recent answers', async () => {

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(makeAnswerComment({ answerId: new UniqueEntityId("answer-01") }))
    }

    const result = await sut.execute({
      answerId: "answer-01",
      page: 2
    })
    expect(result.value?.answersComments).toHaveLength(2)
  })
})
