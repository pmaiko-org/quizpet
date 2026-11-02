<template>
  <UCard
    :ui="{
      root: 'rounded-md border border-default bg-elevated/96 shadow-sm',
      body: 'p-5 sm:p-6',
    }"
  >
    <div
      class="
        flex flex-col gap-4
        sm:flex-row sm:items-start sm:justify-between
      "
    >
      <div class="space-y-1">
        <h2 class="text-base font-semibold text-highlighted">
          {{ $wt("sessions.title") }}
        </h2>
        <p class="max-w-xl text-sm text-muted">
          {{ $wt("sessions.description") }}
        </p>
      </div>

      <UButton
        v-if="sessions.length > 1"
        variant="soft"
        color="neutral"
        icon="i-lucide-log-out"
        :loading="revokingOthers"
        @click="revokeOtherSessions"
      >
        {{ $wt("sessions.revokeOthers") }}
      </UButton>
    </div>

    <div
      v-if="pending"
      class="mt-5 space-y-3"
    >
      <USkeleton
        v-for="index in 2"
        :key="index"
        class="h-20 w-full"
      />
    </div>

    <div
      v-else-if="error"
      class="
        mt-5 flex items-center justify-between gap-4 rounded-md bg-error/10 p-4
      "
    >
      <p class="text-sm text-error">
        {{ $wt("sessions.loadError") }}
      </p>
      <UButton
        size="sm"
        variant="soft"
        @click="() => refresh()"
      >
        {{ $wt("common.retry") }}
      </UButton>
    </div>

    <ul
      v-else
      class="mt-5 space-y-3"
    >
      <li
        v-for="session in sessions"
        :key="session.id"
        class="
          flex flex-col gap-3 rounded-md border border-muted p-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ session.device }}
            </p>
            <UBadge
              v-if="session.current"
              size="sm"
              variant="soft"
            >
              {{ $wt("sessions.current") }}
            </UBadge>
          </div>
          <p class="mt-1 text-xs text-muted">
            {{ session.ipAddress }} ·
            {{ $wt("sessions.lastActivity") }}
            {{ formatDate(session.lastActivityAt) }}
          </p>
        </div>

        <UButton
          size="sm"
          color="error"
          variant="soft"
          :loading="busySessionId === session.id"
          @click="revokeSession(session.id, session.current)"
        >
          {{
            session.current ? $wt("sessions.logout") : $wt("sessions.revoke")
          }}
        </UButton>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const {
  sessions,
  pending,
  error,
  busySessionId,
  revokingOthers,
  refresh,
  revokeSession,
  revokeOtherSessions,
} = useAuthSessions();

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
const { t: $wt } = useCmsWidgetI18n();
</script>
