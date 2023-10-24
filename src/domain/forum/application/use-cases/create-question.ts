import { Either, right } from "../../../../core/either";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Questions } from "../../enterprise/entities/questions";
import { QuestionsRepository } from "../repositories/question-repository";

interface CreateQuestionsUseCaseRequest {
    authorId: string
    title: string
    content: string
    attachmentsIds: string[]
}

type CreateQuestionsUseCaseResponse = Either<null, {
    question: Questions
}>

export class CreateQuestionsUseCase {
    constructor (
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ authorId, title, content, attachmentsIds }: CreateQuestionsUseCaseRequest): 
        Promise<CreateQuestionsUseCaseResponse> {

        const question = Questions.create({
            authorId: new UniqueEntityID(authorId),
            title,
            content
        })

        const questionAttachments = attachmentsIds.map(attachmentId => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id
            })
        })

        question.attachments = new QuestionAttachmentList(questionAttachments) 

        await this.questionsRepository.create(question)

        return right({
            question
        })
    }
}