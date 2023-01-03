export interface IAnswersServiceFindAnswer {
  id: string;
}

export interface IAnswersServiceCreate {
  questionId: string;
  answers_contents: string;
  id: string;
}

export interface IAnswersServiceUpdate {
  answerId: string;
  answers_contents: string;
  id: string;
}

export interface IAnswersServiceDelete {
  answerId: string;
  id: string;
}
