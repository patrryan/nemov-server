export interface IAnswersServiceFindOne {
  id: string;
}

export interface IAnswersServiceFindOneByQuestion {
  questionId: string;
}

export interface IAnswersServiceCreate {
  questionId: string;
  contents: string;
  id: string;
}

export interface IAnswersServiceUpdate {
  answerId: string;
  contents: string;
  id: string;
}

export interface IAnswersServiceDelete {
  answerId: string;
  id: string;
}
