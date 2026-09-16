import type { Ref } from "vue";

import {
  createEmptyPitanyachkaState,
  PitanyachkaPhase,
  type TPitanyachkaClientEvent,
  type TPitanyachkaQuestion,
  type TPitanyachkaServerMessage,
} from "../types";

const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 10000;

export const usePitanyachka = (playerName: Ref<string>) => {
  const apiUrl = useApiUrl();

  const socket = ref<WebSocket | null>(null);
  const connected = ref(false);
  const playerId = ref<string | null>(null);
  const state = ref(createEmptyPitanyachkaState());
  const myQuestion = ref<TPitanyachkaQuestion | null>(null);

  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let isUnmounted = false;

  const isReader = computed(
    () => !!playerId.value && state.value.readerId === playerId.value,
  );

  const buildUrl = () => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${location.host}${apiUrl}/pitanyachka`;
  };

  const send = (event: TPitanyachkaClientEvent, data: unknown = {}) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ event, data }));
    }
  };

  const sendJoin = () => {
    if (playerName.value) {
      send("join", { name: playerName.value });
    }
  };

  const handleMessage = (raw: string) => {
    let message: TPitanyachkaServerMessage;
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    switch (message.event) {
      case "welcome":
        playerId.value = message.data.playerId;
        sendJoin();
        break;
      case "state":
        state.value = message.data;
        if (message.data.phase === PitanyachkaPhase.IDLE) {
          myQuestion.value = null;
        }
        break;
      case "question":
        myQuestion.value = message.data;
        break;
    }
  };

  const scheduleReconnect = () => {
    if (isUnmounted) return;

    const delay = Math.min(
      RECONNECT_BASE_DELAY * 2 ** reconnectAttempts,
      RECONNECT_MAX_DELAY,
    );
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(connect, delay);
  };

  const connect = () => {
    if (isUnmounted) return;

    const ws = new WebSocket(buildUrl());
    socket.value = ws;

    ws.addEventListener("open", () => {
      connected.value = true;
      reconnectAttempts = 0;
      sendJoin();
    });

    ws.addEventListener("message", (event) => {
      handleMessage(event.data as string);
    });

    ws.addEventListener("close", () => {
      connected.value = false;
      socket.value = null;
      scheduleReconnect();
    });

    ws.addEventListener("error", () => {
      ws.close();
    });
  };

  watch(playerName, () => {
    if (connected.value) sendJoin();
  });

  onMounted(connect);

  onBeforeUnmount(() => {
    isUnmounted = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    socket.value?.close();
  });

  const start = () => send("start");
  const reset = () => send("reset");
  const generateQuestion = () => send("generateQuestion");
  const passTurn = () => send("passTurn");

  return {
    connected,
    playerId,
    state,
    myQuestion,
    isReader,
    start,
    reset,
    generateQuestion,
    passTurn,
  };
};
