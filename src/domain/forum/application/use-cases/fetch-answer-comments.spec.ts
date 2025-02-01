import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudenteRepository: InMemoryStudentRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Get answers by answer Id', () => {
  beforeEach(() => {
    inMemoryStudenteRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudenteRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })
  it('should be able to fetch recent answers', async () => {
    const student = makeStudent()

    await inMemoryStudenteRepository.items.push(student)

    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-01'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-01'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-01'),
        authorId: student.id,
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
  })

  it('should be able to fetch paginated recent answers', async () => {
    const student = makeStudent()

    inMemoryStudenteRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-01'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 2,
    })
    expect(result.value?.comments).toHaveLength(2)
  })
})
