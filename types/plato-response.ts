/* ===============================
   共通エラー型
=============================== */

export type PlatoErrorResponse = {
  error: string;
};

/* ===============================
   Execute API
=============================== */

export type ExecuteUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
};

export type ExecuteResponse = {
  content: string;
  usage: ExecuteUsage;
};

/* ===============================
   Usage API
=============================== */

export type MonthlyUsage = {
  limit: number;
  used: number;
  remaining: number;
  executionCount: number;
  totalTokens: number;
};

export type DailyUsage = {
  used: number;
  executionCount: number;
  totalTokens: number;
};

export type UsageResponse = {
  monthly: MonthlyUsage;
  daily: DailyUsage;
  maxTokensPerReq: number;
};

/* ===============================
   History API
=============================== */

export type ExecutionHistoryItem = {
  id: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  createdAt: string;
};

export type HistoryResponse = {
  count: number;
  data: ExecutionHistoryItem[];
};

/* ===============================
   Dashboard API
=============================== */

export type ModelBreakdown = {
  model: string;
  _count: number;
  _sum: {
    totalTokens: number | null;
    cost: number | null;
  };
};

export type DashboardResponse = {
  limit: number;
  used: number;
  remaining: number;
  maxTokensPerReq: number;
  monthly: {
    executionCount: number;
    totalTokens: number;
    totalCost: number;
  };
  modelBreakdown: ModelBreakdown[];
  recentExecutions: {
    id: string;
    model: string;
    totalTokens: number;
    cost: number;
    createdAt: string;
  }[];
};

/* ===============================
   API Key
=============================== */

export type ApiKeyItem = {
  id: string;
  name: string;
  createdAt: string;
};

export type ApiKeyListResponse = ApiKeyItem[];

export type ApiKeyCreateResponse = {
  apiKey: string;
};

export type ApiKeyDeleteResponse = {
  success: boolean;
};
