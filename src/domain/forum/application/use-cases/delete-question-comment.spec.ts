import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let iMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let iMemoryStudentRepository: InMemoryStudentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete a question comment', () => {
  beforeEach(() => {
    iMemoryStudentRepository = new InMemoryStudentRepository()

    iMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      iMemoryStudentRepository,
    )
    sut = new DeleteQuestionCommentUseCase(iMemoryQuestionCommentRepository)
  })
  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment()

    await iMemoryQuestionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('not should be able to delete a question comment with diferent authorId', async () => {
    const newQuestionComment = makeQuestionComment()

    await iMemoryQuestionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'diferent-author-id',
      questionCommentId: newQuestionComment.id.toString(),
    })
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
