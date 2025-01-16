import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository"
import { AuthenticateStudentUseCase } from "./authenticate-student"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { HashComparer } from "../cryptography/hash-comparer"
import { Encrypter } from "../cryptography/encrypter"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { makeStudent } from "test/factories/make-student"
import { access } from "fs"
import exp from "constants"


let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher(),
      fakeEncrypter = new FakeEncrypter(),
      sut = new AuthenticateStudentUseCase(inMemoryStudentRepository, fakeHasher, fakeEncrypter)
  })
  it('should be able authenticate a student', async () => {
    const student = makeStudent({
      email: "jhondoe@example.com",
      password: await fakeHasher.hash("123456")
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })

  })
})
