export enum WarStatus {
  WAITING = "WAITING",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

export interface IWarParticipant {
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  joinedAt: string;
  score?: number;
  accuracy?: number;
  rank?: number;
}

export interface IWar {
  _id: string;
  warId: string;
  questionPaperId: {
    _id: string;
    examName: string;
  };
  creatorId: {
    _id: string;
    name: string;
  };
  status: WarStatus;
  maxPlayers: number;
  scheduledStartTime: string;
  actualStartTime?: string;
  participants: IWarParticipant[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ICreateWarInput {
  questionPaperId: string;
  maxPlayers: number;
  scheduledStartTime: string;
}

export interface IJoinWarInput {
  warId: string;
}
