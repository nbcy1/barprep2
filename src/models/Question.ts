/* tslint:disable */
/* eslint-disable */
// This is a manually created Amplify DataStore model for Question

import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export declare class Question {
  readonly id: string;
  readonly question: string;
  readonly choices: string; // stored as JSON string
  readonly answer: string;
  readonly topic?: string | null;

  constructor(init: ModelInit<Question>);
  static copyOf(
    source: Question,
    mutator: (draft: MutableModel<Question>) => MutableModel<Question> | void
  ): Question;
}
