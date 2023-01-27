export interface AnswersServiceFindOne {
  answerId: string;
}

export interface AnswersServiceFindOneByQuestion {
  questionId: string;
}

export interface AnswersServiceCreate {
  questionId: string;
  contents: string;
  id: string;
}

export interface AnswersServiceUpdate {
  answerId: string;
  contents: string;
  id: string;
}

export interface AnswersServiceDelete {
  answerId: string;
  id: string;
}
