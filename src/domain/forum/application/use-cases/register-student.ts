import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exist-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseReponse = Either<StudentAlreadyExistsError, {
  student: Student
}>

@Injectable()
export class RegisterStudentUseCase {
  // dependencias
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    name,
    email,
    password
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseReponse> {

    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    })

    await this.studentsRepository.create(
      student,
    )

    return right({
      student
    })
  }
}
