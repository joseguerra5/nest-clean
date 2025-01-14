import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(
  // overide faz receber todas as propriedades do notificationprops como opcional
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  const notification = Notification.create({
    title: faker.lorem.sentence(4),
    content: faker.lorem.sentence(10),
    recipientId: new UniqueEntityId(),
    ...overide
  }, id)

  return notification
}