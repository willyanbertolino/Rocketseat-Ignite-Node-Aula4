import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Questions } from "../../enterprise/entities/questions";

export interface QuestionsRepository {
    findById(id: string): Promise<Questions | null>
    findBySlug(slug: string): Promise<Questions | null>
    findManyRecent(params: PaginationParams): Promise<Questions[]>
    create(question: Questions): Promise<void>
    save(question: Questions): Promise<void>
    delete(question: Questions): Promise<void>
}