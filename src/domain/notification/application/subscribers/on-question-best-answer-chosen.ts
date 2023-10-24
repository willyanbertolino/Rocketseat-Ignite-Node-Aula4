import { DomainEvents } from "../../../../core/events/domain-events";
import { EventHandler } from "../../../../core/events/event-handler";
import { AnswerRepository } from "../../../forum/application/repositories/answer-repository";
import { QuestionsRepository } from "../../../forum/application/repositories/question-repository";
import { AnswerCreatedEvent } from "../../../forum/enterprise/events/answer-created-event";
import { QuestionBestAnswerChosenEvent } from "../../../forum/enterprise/events/question-best-answer-chosen-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private answerRepository: AnswerRepository,
        private sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendQuestionBestAnswerNotification.bind(this), 
            QuestionBestAnswerChosenEvent.name
        )
    }

    private async sendQuestionBestAnswerNotification ({ question, bestAnswerId }: QuestionBestAnswerChosenEvent) {
        const answer = await this.answerRepository.findById(bestAnswerId.toString())

        if(answer) {
            await this.sendNotificationUseCase.execute({
                recipientId: answer.authorId.toString(),
                title: `Resposta destaque`,
                content: `A resposta que você enviou para "${question.title.substring(0, 20).concat('...')}" foi escolhida como a melhor pelo autor`
            })
        }

    }
}