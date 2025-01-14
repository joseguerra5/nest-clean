import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository

let sut: ChooseQuestionBestAnswerAnswerUseCase

describe('Choose a question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new ChooseQuestionBestAnswerAnswerUseCase(inMemoryAnswerRepository, inMemoryQuestionRepository)
  })
  it('should be able to choose the question best answer', async () => {

    const newQuestion = makeQuestion()

    const newAnswer = makeAnswer({
      questionId: newQuestion.id
    })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
  })

  it('not should be able to choose the question best answer with wrong author id', async () => {

    const newQuestion = makeQuestion()

    const newAnswer = makeAnswer({
      questionId: newQuestion.id
    })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "wrongg-id",
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})
