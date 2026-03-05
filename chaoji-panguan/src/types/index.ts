export type JudgmentMode = 'anonymous' | 'realname';

export type JudgmentStyle = 'neutral' | 'sarcastic' | 'peacemaker' | 'rational' | 'humor';

export interface JudgmentStyleOption {
  id: JudgmentStyle;
  name: string;
  description: string;
  icon: string;
}

export const JudgmentStyles: JudgmentStyleOption[] = [
  { id: 'neutral', name: '中立判官', description: '公平公正，不偏不倚', icon: '⚖️' },
  { id: 'sarcastic', name: '毒舌判官', description: '犀利吐槽，直击要害', icon: '🔥' },
  { id: 'peacemaker', name: '和事佬', description: '各打五十大板', icon: '🕊️' },
  { id: 'rational', name: '理性分析帝', description: '数据党的胜利', icon: '📊' },
  { id: 'humor', name: '欢乐判官', description: '搞笑担当，乐一乐', icon: '😄' },
];

export interface Opinion {
  partyA: string;
  partyB: string;
}

export interface ChatMessage {
  id: number;
  sender: 'partyA' | 'partyB';
  content: string;
  time: string;
}

export interface DimensionScore {
  label: string;
  value: string;
  score: 'good' | 'medium' | 'poor';
}

export interface DialogLine {
  speaker: 'partyA' | 'partyB';
  content: string;
  emoji: string;
}

export interface Highlight {
  text: string;
  type: 'winner' | 'loser' | 'humor' | 'wisdom';
}

export interface Suggestion {
  title: string;
  content: string;
}

export interface Judge {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  style: JudgmentStyle;
  totalCases: number;
  winRates: Record<string, number>;
  createdAt: string;
}

export interface JudgmentSuggestion {
  winner: 'partyA' | 'partyB' | 'draw';
  winnerName: string;
  subtitle: string;
  reason: string;
  dimensions: DimensionScore[];
  highlights?: Highlight[];
  suggestions?: Suggestion[];
}

export interface JudgmentResult {
  winner: 'partyA' | 'partyB' | 'draw';
  winnerName: string;
  subtitle: string;
  reason: string;
  dimensions: DimensionScore[];
  dialogLines?: DialogLine[];
  highlights?: Highlight[];
  suggestions?: Suggestion[];
  randomEvent?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  winner: 'partyA' | 'partyB' | 'draw';
  winnerName: string;
  preview: string;
  result: JudgmentResult;
  mode: JudgmentMode;
}
