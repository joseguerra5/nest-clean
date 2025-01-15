import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseReponse = Either<WrongCredentialsError, {
  accessToken: string
}>

@Injectable()
export class AuthenticateStudentUseCase {
  // dependencias
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter
  ) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    email,
    password
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseReponse> {

    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(password, student.password)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({sub: student.id.toString()})


    return right({
      accessToken
    })
  }
}
