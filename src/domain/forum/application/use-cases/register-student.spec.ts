import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })
  it('should be able Register a student', async () => {
    const result = await sut.execute({
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: "123456"

    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0]).toEqual(result.value)
  })
})
