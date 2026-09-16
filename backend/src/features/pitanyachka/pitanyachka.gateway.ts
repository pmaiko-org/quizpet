import { randomUUID } from "node:crypto";

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Server, WebSocket } from "ws";

import { PITANYACHKA_QUESTIONS } from "./pitanyachka.questions";
import {
  PitanyachkaPhase,
  type TPitanyachkaCategory,
  type TPitanyachkaJoinPayload,
  type TPitanyachkaPlayer,
  type TPitanyachkaPublicState,
  type TPitanyachkaQuestion,
  type TPitanyachkaStartPayload,
} from "./pitanyachka.types";

const PITANYACHKA_CATEGORIES: readonly TPitanyachkaCategory[] = (() => {
  const map = new Map<string, TPitanyachkaCategory>();

  for (const question of PITANYACHKA_QUESTIONS) {
    const existing = map.get(question.category);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(question.category, {
        name: question.category,
        emoji: question.emoji,
        count: 1,
      });
    }
  }

  return [...map.values()];
})();

const CATEGORY_NAMES = new Set(
  PITANYACHKA_CATEGORIES.map(category => category.name),
);

@WebSocketGateway({ path: "/backend/pitanyachka" })
export class PitanyachkaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server!: Server;

  private readonly sockets = new Map<WebSocket, string>();
  private readonly players = new Map<string, TPitanyachkaPlayer>();
  private readonly usedIds = new Set<number>();

  private started = false;
  private phase = PitanyachkaPhase.IDLE;
  private readerId: string | null = null;
  private currentQuestion: TPitanyachkaQuestion | null = null;
  private selectedCategory: string | null = null;

  handleConnection(client: WebSocket): void {
    const playerId = randomUUID();
    this.sockets.set(client, playerId);
    this.players.set(playerId, { id: playerId, name: "" });
    this.emit(client, "welcome", { playerId });
    this.emit(client, "categories", PITANYACHKA_CATEGORIES);
    this.broadcastState();
  }

  handleDisconnect(client: WebSocket): void {
    const playerId = this.sockets.get(client);
    this.sockets.delete(client);

    if (!playerId) return;
    this.players.delete(playerId);

    if (this.readerId === playerId) {
      this.returnToIdle();
    }

    this.broadcastState();
  }

  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: TPitanyachkaJoinPayload,
  ): void {
    const player = this.getPlayer(client);
    if (!player) return;

    player.name = (payload?.name ?? "").trim().slice(0, 60) || "Гравець";
    this.broadcastState();
  }

  @SubscribeMessage("start")
  handleStart(@MessageBody() payload: TPitanyachkaStartPayload): void {
    const category = payload?.category ?? null;
    this.selectedCategory =
      category && CATEGORY_NAMES.has(category) ? category : null;
    this.started = true;
    this.usedIds.clear();
    this.returnToIdle();
    this.broadcastState();
  }

  @SubscribeMessage("restart")
  handleRestart(): void {
    this.started = false;
    this.selectedCategory = null;
    this.usedIds.clear();
    this.returnToIdle();
    this.broadcastState();
  }

  @SubscribeMessage("generateQuestion")
  handleGenerateQuestion(@ConnectedSocket() client: WebSocket): void {
    const player = this.getPlayer(client);
    if (!player || !player.name) return;
    if (!this.started || this.phase !== PitanyachkaPhase.IDLE) return;

    const question = this.pickRandomQuestion();
    if (!question) {
      this.broadcastState();
      return;
    }

    this.phase = PitanyachkaPhase.READING;
    this.readerId = player.id;
    this.currentQuestion = question;

    this.emit(client, "question", {
      category: question.category,
      emoji: question.emoji,
      text: question.text,
      hint: question.hint,
    });
    this.broadcastState();
  }

  @SubscribeMessage("passTurn")
  handlePassTurn(@ConnectedSocket() client: WebSocket): void {
    const player = this.getPlayer(client);
    if (!player) return;
    if (
      this.phase !== PitanyachkaPhase.READING ||
      this.readerId !== player.id
    ) {
      return;
    }

    if (this.currentQuestion) {
      this.usedIds.add(this.currentQuestion.id);
    }
    this.returnToIdle();
    this.broadcastState();
  }

  private returnToIdle(): void {
    this.phase = PitanyachkaPhase.IDLE;
    this.readerId = null;
    this.currentQuestion = null;
  }

  private activePool(): TPitanyachkaQuestion[] {
    return PITANYACHKA_QUESTIONS.filter(
      question =>
        !this.selectedCategory || question.category === this.selectedCategory,
    );
  }

  private pickRandomQuestion(): TPitanyachkaQuestion | null {
    const available = this.activePool().filter(
      question => !this.usedIds.has(question.id),
    );
    if (!available.length) return null;

    const index = Math.floor(Math.random() * available.length);
    return available[index];
  }

  private getPlayer(client: WebSocket): TPitanyachkaPlayer | undefined {
    const playerId = this.sockets.get(client);
    return playerId ? this.players.get(playerId) : undefined;
  }

  private buildState(): TPitanyachkaPublicState {
    const reader = this.readerId ? this.players.get(this.readerId) : null;
    const pool = this.activePool();
    const usedInPool = pool.filter(question =>
      this.usedIds.has(question.id),
    ).length;

    return {
      started: this.started,
      phase: this.phase,
      players: [...this.players.values()].filter(player => player.name),
      readerId: this.phase === PitanyachkaPhase.READING ? this.readerId : null,
      readerName: reader?.name ?? null,
      selectedCategory: this.selectedCategory,
      usedCount: usedInPool,
      remaining: pool.length - usedInPool,
      total: pool.length,
    };
  }

  private broadcastState(): void {
    const state = this.buildState();
    const message = JSON.stringify({ event: "state", data: state });

    for (const client of this.sockets.keys()) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  }

  private emit(client: WebSocket, event: string, data: unknown): void {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  }
}
