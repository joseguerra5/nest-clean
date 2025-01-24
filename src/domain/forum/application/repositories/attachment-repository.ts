// interface para dizer os metodos que o repositorio tem que ter
import { Attachment } from '../../enterprise/entities/attachment';

export abstract class AttachmentsRepository {
  abstract create(attach: Attachment): Promise<void>

}
