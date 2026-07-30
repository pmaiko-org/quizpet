<template>
  <div class="min-h-screen bg-default">
    <header class="border-b border-default">
      <UContainer class="flex items-center justify-between gap-4 py-4">
        <NuxtLink
          to="/"
          class="text-lg font-semibold text-highlighted"
        >
          QuizPet
        </NuxtLink>
        <UColorModeSwitch />
      </UContainer>
    </header>

    <UContainer class="max-w-3xl py-8">
      <div class="space-y-3">
        <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
          Політика конфіденційності та умови використання
        </h1>
        <p class="text-sm text-muted">
          QuizPet — невеликий некомерційний навчальний застосунок (флеш-картки).
          Ця сторінка простою мовою пояснює, які дані ми обробляємо, навіщо і як
          довго, а також містить короткі умови використання.
        </p>
        <p class="text-sm text-muted">
          Дата останнього оновлення: <strong>[ВКАЖІТЬ ДАТУ]</strong>
        </p>
      </div>

      <div class="mt-8 space-y-8 text-sm/6 text-toned">
        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            1. Хто обробляє дані
          </h2>
          <p>
            Проєкт веде приватна особа (автор проєкту). Це особистий
            некомерційний проєкт для автора та його друзів.
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li>
              Автор / відповідальна особа:
              <strong>[ВАШЕ ІМ'Я АБО НІКНЕЙМ]</strong>
            </li>
            <li>
              Контакт для звернень: <strong>[ВАШ EMAIL ДЛЯ ЗВ'ЯЗКУ]</strong>
            </li>
          </ul>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            2. Які дані ми збираємо
          </h2>
          <p>Ми збираємо мінімум, потрібний для роботи входу та профілю:</p>
          <ul class="list-disc space-y-1 pl-5">
            <li>ідентифікатор облікового запису Google (Google ID);</li>
            <li>email;</li>
            <li>
              ім'я та прізвище (для показу у профілі та списку користувачів);
            </li>
            <li>аватар (зображення профілю);</li>
            <li>створений вами контент — набори карток і картки.</li>
          </ul>
          <p>
            Ми <strong>не</strong> зберігаємо паролі: вхід відбувається лише
            через Google. Реклами, аналітики, трекерів і піксельного відстеження
            у проєкті немає.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            3. Дані, отримані через Google
          </h2>
          <p>
            Під час входу через Google ми запитуємо лише два дозволи (scopes):
            <code>email</code> та <code>profile</code>. Від Google ми отримуємо:
            email, ім'я, прізвище, зображення профілю та Google ID.
          </p>
          <p>
            Токени доступу Google (access token / refresh token)
            <strong>не зберігаються</strong> — вони використовуються лише в
            момент авторизації й одразу відкидаються.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            4. Як ми використовуємо дані
          </h2>
          <ul class="list-disc space-y-1 pl-5">
            <li>автентифікація та підтримання сесії входу;</li>
            <li>показ вашого профілю та імені в інтерфейсі;</li>
            <li>збереження ваших наборів карток і прогресу.</li>
          </ul>
          <p>Ми не продаємо дані та не передаємо їх третім сторонам.</p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            5. Cookies та локальне сховище
          </h2>
          <p>
            Ми використовуємо лише технічно необхідні для входу та безпеки
            механізми, без маркетингових cookies:
          </p>
          <ul class="list-disc space-y-1 pl-5">
            <li>
              <code>accessToken</code> — cookie сесії (<code>Secure</code>,
              <code>SameSite=Lax</code>);
            </li>
            <li>
              <code>refreshToken</code> — у локальному сховищі браузера
              (localStorage) для поновлення сесії.
            </li>
          </ul>
          <p>
            Оскільки використовуються лише необхідні для роботи механізми,
            окремого банера згоди на cookies немає.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            6. Скільки ми зберігаємо дані
          </h2>
          <p>
            Дані облікового запису та ваш контент зберігаються, доки існує ваш
            акаунт. Після видалення акаунта пов'язані дані видаляються (див.
            розділ 7). Токен сесії має обмежений строк життя й оновлюється
            автоматично.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            7. Видалення акаунта та даних
          </h2>
          <p>Видалити акаунт можна двома способами:</p>
          <ul class="list-disc space-y-1 pl-5">
            <li>
              у налаштуваннях профілю — кнопка «Видалити акаунт» (потрібно
              підтвердити свій email);
            </li>
            <li>
              або написавши автору на <strong>[ВАШ EMAIL ДЛЯ ЗВ'ЯЗКУ]</strong>.
            </li>
          </ul>
          <p>
            Під час видалення видаляються ваш обліковий запис, аватар і створені
            вами набори карток. Для підтвердження особи потрібні активний вхід і
            підтвердження вашого email.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            8. Короткі умови використання
          </h2>
          <ul class="list-disc space-y-1 pl-5">
            <li>сервіс надається «як є», без гарантій доступності;</li>
            <li>використовуйте сервіс законно й не зловживайте ним;</li>
            <li>ви відповідаєте за контент, який створюєте;</li>
            <li>сервіс некомерційний і може змінюватися або зупинятися.</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h2 class="text-xl font-semibold text-highlighted">
            9. Зміни цієї політики
          </h2>
          <p>
            Ми можемо оновлювати цю сторінку. Актуальна версія завжди доступна
            за адресою <code>/privacy</code>.
          </p>
        </section>
      </div>

      <div class="mt-10 border-t border-default pt-6">
        <UButton
          to="/"
          variant="soft"
          icon="i-lucide-arrow-left"
        >
          На головну
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

useHead({
  title: "Конфіденційність та умови — QuizPet",
});
</script>
