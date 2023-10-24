import { DomainEvents } from "../../src/core/events/domain-events"
import { PaginationParams } from "../../src/core/repositories/pagination-params"
import { AnswersAttachmentRepository } from "../../src/domain/forum/application/repositories/answer-attachments-repository"
import { AnswerRepository } from "../../src/domain/forum/application/repositories/answer-repository"
import { Answer } from "../../src/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswerRepository {
    public items: Answer[] = []

    constructor(
        private answersAttachmentRepository: AnswersAttachmentRepository
    ) {}

    async findById(id: string) {
        const answer = this.items.find(item => item.id.toString() === id)
        
        if(!answer) {
            return null
        }
        
        return answer
    }
    
    async create(answer: Answer) {
        this.items.push(answer)

        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async save(answer: Answer) {
        const itemIndex = this.items.findIndex(item => item.id === answer.id)
        
        this.items[itemIndex] = answer

        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const answers = this.items
            .filter(item => item.questionId.toString() === questionId)
            .slice((page-1)*20, page*20)
        
        return answers
    }

    async delete(answer: Answer) {
        const itemIndex = this.items.findIndex(item => item.id === answer.id)

        this.items.splice(itemIndex, 1)

        this.answersAttachmentRepository.deleteManyByAnswerId(answer.id.toString())
    }
}