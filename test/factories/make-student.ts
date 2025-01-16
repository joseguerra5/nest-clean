import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student, StudentProps, } from "@/domain/forum/enterprise/entities/student";

export function makeStudent(
  // overide faz receber todas as propriedades do studentprops como opcional
  overide: Partial<StudentProps> = {},
  id?: UniqueEntityId,
) {
  const student = Student.create({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    ...overide
  }, id)

  return student
}