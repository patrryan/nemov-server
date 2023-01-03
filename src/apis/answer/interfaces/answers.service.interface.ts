export interface IAnswersServiceFindAnswer {
  id: string;
}

export interface IAnswersServiceCreate {
  answer_contentsId: string;
  id: string;
}

export interface IAnswersServiceUpdate {
  answerId: string;
  answer_contentsId: string;
  id: string;
}

export interface IAnswersServiceDelete {
  answerId: string;
  id: string;
}
