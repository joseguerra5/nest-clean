import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  // o ID é opcional porque o construtor muita das vezes não vamos criar o student do zero
  static create(props: Student, id?: UniqueEntityId) {
    const student = new Student(props, id)

    return student
  }
}
