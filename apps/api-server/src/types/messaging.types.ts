// src/types/messaging.types.ts
import { Role } from "@prisma/client";

export interface AuthUserContext {
  id: number;
  role: Role;
}

/* ---------- Conversations ---------- */

export interface StartConversationInput {
  participantId: number; // other user
}

export interface ConversationListItem {
  id: number;
  lastMessage?: {
    id: number;
    content: string;
    createdAt: Date;
  } | null;
}

/* ---------- Messages ---------- */

export interface SendMessageInput {
  content: string;
}
