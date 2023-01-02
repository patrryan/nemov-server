import { CreateQuestionInput } from '../dto/create-question.input';
import { UpdateQuestionInput } from '../dto/update-question.update';

export interface IQuestionsServiceFIndReview {
  id: string;
}

export interface IQuestionsServiceCreate {
  createQuestionInput: CreateQuestionInput;
  id: string;
  productId: string;
}

export interface IQuestionsServiceUpdate {
  questionId: string;
  updateQuestionInput: UpdateQuestionInput;
  id: string;
}

export interface IQuestionsServiceDelete {
  questionId: string;
  id: string;
}
