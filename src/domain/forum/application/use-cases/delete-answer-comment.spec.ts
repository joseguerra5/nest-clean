import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let iMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete a answer comment', () => {
  beforeEach(() => {
    iMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerCommentUseCase(iMemoryAnswerCommentRepository)
  })
  it('should be able to delete a answer comment', async () => {

    const newAnswerComment = makeAnswerComment()

    await iMemoryAnswerCommentRepository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString()
    })


    expect(result.isRight()).toBe(true)
  })

  it('not should be able to delete a answer comment with diferent authorId', async () => {


    const newAnswerComment = makeAnswerComment()

    await iMemoryAnswerCommentRepository.create(newAnswerComment)


    const result = await sut.execute({
      authorId: "diferent-author-id",
      answerCommentId: newAnswerComment.id.toString()
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

})
