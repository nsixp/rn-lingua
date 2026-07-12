export type LanguageCode = "es" | "fr" | "ja" | "ko" | "zh";

export type LessonLevel = "beginner" | "elementary" | "intermediate";

export type LearningSkill =
  | "vocabulary"
  | "listening"
  | "speaking"
  | "reading"
  | "translation";

export type ActivityType =
  | "vocabulary-card"
  | "multiple-choice"
  | "translate"
  | "match-pairs"
  | "listen-repeat";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "interjection";

export type ScriptDirection = "ltr" | "rtl";

export type SupportedLanguage = {
  id: LanguageCode;
  name: string;
  nativeName: string;
  flagEmoji: string;
  direction: ScriptDirection;
  description: string;
  accentColor: string;
  starterUnitId: string;
  isEnabled: boolean;
};

export type LessonGoal = {
  id: string;
  title: string;
  description: string;
};

export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech: PartOfSpeech;
  example?: string;
};

export type PhraseItem = {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
  usageNote?: string;
};

export type ActivityChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type MatchPair = {
  id: string;
  prompt: string;
  answer: string;
};

type BaseActivity = {
  id: string;
  type: ActivityType;
  skill: LearningSkill;
  prompt: string;
  xpReward: number;
};

export type VocabularyCardActivity = BaseActivity & {
  type: "vocabulary-card";
  vocabularyId: string;
};

export type MultipleChoiceActivity = BaseActivity & {
  type: "multiple-choice";
  choices: ActivityChoice[];
  explanation?: string;
};

export type TranslateActivity = BaseActivity & {
  type: "translate";
  correctAnswer: string;
  acceptedAnswers: string[];
};

export type MatchPairsActivity = BaseActivity & {
  type: "match-pairs";
  pairs: MatchPair[];
};

export type ListenRepeatActivity = BaseActivity & {
  type: "listen-repeat";
  phraseId: string;
  speakableText: string;
};

export type LessonActivity =
  | VocabularyCardActivity
  | MultipleChoiceActivity
  | TranslateActivity
  | MatchPairsActivity
  | ListenRepeatActivity;

export type LearningUnit = {
  id: string;
  languageId: LanguageCode;
  title: string;
  description: string;
  order: number;
  level: LessonLevel;
  color: string;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  languageId: LanguageCode;
  unitId: string;
  title: string;
  subtitle: string;
  order: number;
  level: LessonLevel;
  xpReward: number;
  estimatedMinutes: number;
  coverEmoji: string;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: LessonActivity[];
  aiTeacherPrompt: string;
};
