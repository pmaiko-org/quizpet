export enum StatusCodes {
  UNAUTHORIZED = 401,
}

export const RouteName = {
  INDEX: "index",
  LOGIN: "login",
  PRIVACY: "privacy",
  FOLDERS: "folders",
  STATISTIC: "statistic",
  PEOPLES: "peoples",
  PROFILE: "profile",
  SETS: "sets",
  SETS_CREATE: "sets-create",
  SETS_ID_EDIT: "sets-id-edit",
  SETS_ID_LEARN: "sets-id-learn",
} as const;

export const PROJECT_LINKS = {
  github: "https://github.com/pmaiko-org/quizpet",
  telegram: "https://t.me/petyamaiko",
} as const;
