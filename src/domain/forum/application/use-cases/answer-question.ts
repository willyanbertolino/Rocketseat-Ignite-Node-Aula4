import { Either, right } from "../../../../core/either"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerRepository } from "../repositories/answer-repository"

interface AnswerQuestionsUseCaseRequest {
    instructorId: string
    questionId: string
    content: string
    attachmentsIds: string[]
}

type AnswerQuestionsUseCaseResponse = Either<null, {
    answer: Answer
}>

export class AnswerQuestionsUseCase {
    constructor (
        private answerRepository: AnswerRepository
    ) {}

    async execute({ instructorId, questionId, content, attachmentsIds }: AnswerQuestionsUseCaseRequest):
      Promise<AnswerQuestionsUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId),
        })

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id
            })
        })

        answer.attachments = new AnswerAttachmentList(answerAttachments) 

        await this.answerRepository.create(answer)

        return right({
            answer
        })
    }
}