import { Either, left, right } from "../../../../core/either";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Questions } from "../../enterprise/entities/questions";
import { QuestionsAttachmentRepository } from "../repositories/question-attachments-repository";
import { QuestionsRepository } from "../repositories/question-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface EditQuestionsUseCaseRequest {
    authorId: string
    questionId: string
    title: string
    content: string
    attachmentsIds: string[]
}

type EditQuestionsUseCaseResponse = Either< ResourceNotFoundError| NotAllowedError,{
    question: Questions
}>

export class EditQuestionsUseCase {
    constructor (
        private questionsRepository: QuestionsRepository,
        private questionsAttachmentRepository: QuestionsAttachmentRepository
    ) {}

    async execute({ questionId, authorId, title, content, attachmentsIds }: EditQuestionsUseCaseRequest): 
        Promise<EditQuestionsUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if(!question) {
            return left(new ResourceNotFoundError())
        }

        if(authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachment = await this.questionsAttachmentRepository
            .findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachment)

        const questionAttachment = attachmentsIds.map(attachmentId => {
                return QuestionAttachment.create({
                    attachmentId: new UniqueEntityID(attachmentId),
                    questionId: question.id
                }
                )
        })

        questionAttachmentList.update(questionAttachment)
        question.attachments = questionAttachmentList
        question.title = title
        question.content = content
        
        await this.questionsRepository.save(question)

        return right({
            question
        })
    }
}