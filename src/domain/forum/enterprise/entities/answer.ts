import { AggregateRoot } from "../../../../core/entities/aggregate-root"
import { Entity } from "../../../../core/entities/entity"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"
import { AnswerCreatedEvent } from "../events/answer-created-event"
import { AnswerAttachmentList } from "./answer-attachment-list"

export interface AnswerProps {
    questionId: UniqueEntityID
    authorId: UniqueEntityID
    content: string
    attachments: AnswerAttachmentList
    createdAt: Date
    updateAt ?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
    get questionId() {
        return this.props.questionId
    }
    get authorId() {
        return this.props.authorId
    }
    get content() {
        return this.props.content
    }
    get attachments() {
        return this.props.attachments
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updateAt() {
        return this.props.updateAt
    }
    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    set content(content: string){
        this.props.content = content
        this.touch()
    }
    set attachments(attachments: AnswerAttachmentList){
        this.props.attachments = attachments
        this.touch()
    }

    private touch() {
        this.props.updateAt = new Date
    }

    static create (
        props: Optional<AnswerProps, 'createdAt' | 'attachments'>, 
        id?: UniqueEntityID
        ) {
        const answer = new Answer({
            ...props,
            attachments: props.attachments ?? new AnswerAttachmentList(),
            createdAt: props.createdAt ?? new Date()
        }, id)

        const isNewAnswer = !id

        if(isNewAnswer){
            answer.addDomainEvent(new AnswerCreatedEvent(answer))
        }

        return answer
    }
}