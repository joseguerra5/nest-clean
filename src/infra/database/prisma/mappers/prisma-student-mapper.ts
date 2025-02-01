import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { User as PrismaStudent, Prisma } from '@prisma/client'

export class PrismaStudentMapper {
  static toDoomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      password: student.password,
    }
  }
}
