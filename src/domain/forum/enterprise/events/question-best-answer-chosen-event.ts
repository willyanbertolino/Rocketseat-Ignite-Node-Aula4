import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { DomainEvent } from "../../../../core/events/domain-event";
import { Answer } from "../entities/answer";
import { Questions } from "../entities/questions";

export class QuestionBestAnswerChosenEvent implements DomainEvent{
    public ocurredAt: Date;
    public question: Questions;
    public bestAnswerId: UniqueEntityID;

    constructor(question: Questions, bestAnswerId: UniqueEntityID) {
        this.question = question
        this.bestAnswerId = bestAnswerId
        this.ocurredAt = new Date()
    }

    getAggregateId(): UniqueEntityID {
        return this.question.id
    }
}