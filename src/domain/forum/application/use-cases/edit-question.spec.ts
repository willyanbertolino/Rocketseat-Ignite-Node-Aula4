import { expect, it, beforeEach, describe } from 'vitest'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { makeQuestion } from '../../../../../test/factories/make-questions'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { EditQuestionsUseCase } from './edit-question'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionsUseCase

describe('Edit Questions', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new EditQuestionsUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
    })
    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            }),
        )

        await sut.execute({
            questionId: newQuestion.id.toString(),
            authorId: 'author-1',
            title: 'pergunta teste',
            content: 'novo conteudo',
            attachmentsIds: ['1', '3']
        })
        
        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'pergunta teste',
            content: 'novo conteudo'
        })

        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('3')}),
        ])
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
                questionId: newQuestion.id.toString(),
                authorId: 'author-2',
                title: 'pergunta teste',
                content: 'novo conteudo',
                attachmentsIds: []
            })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})