// interface para dizer os metodos que o repositorio tem que ter

import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>

}
