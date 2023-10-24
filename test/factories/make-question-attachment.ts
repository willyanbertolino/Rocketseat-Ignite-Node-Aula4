import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import { QuestionAttachment, QuestionAttachmentProps } from "../../src/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {}, 
    id?: UniqueEntityID
    ) {
    const questionAttachment = QuestionAttachment.create({
        attachmentId: new UniqueEntityID(),
        questionId: new UniqueEntityID(),
        ...override
    },
    id
    )

    return questionAttachment
}

