---
description: Пересобрать и обновить политику конфиденциальности, условия и тексты согласия по реальному коду
argument-hint: "[что изменилось, напр. 'добавил Google Analytics' или 'убрал поле phone']"
---

Ты обновляешь пользовательские политики проекта QuizPet (некоммерческий личный проект). Задача — синхронизировать страницу `/privacy` и тексты согласия с тем, что **реально** делает код прямо сейчас. Работай на русском, код и идентификаторы — на английском.

Контекст изменений от пользователя (может быть пустым): $ARGUMENTS

## Шаг 1. Заново провести мини-аудит по коду (не по памяти)

Проверь и выпиши фактическое состояние:

1. **Персональные данные в БД** — поля `UserEntity` ([backend/src/features/users/user.entity.ts](backend/src/features/users/user.entity.ts)) и связанные сущности (`SetEntity`, `CardEntity`, `StorageFileEntity`). Что реально хранится про пользователя.
2. **OAuth scopes и данные от Google** — `scope` в [backend/src/features/auth/google.strategy.ts](backend/src/features/auth/google.strategy.ts) и что берётся из `profile` в [auth.service.ts](backend/src/features/auth/auth.service.ts) (`validateUser`). Проверь, что Google access/refresh токены по-прежнему **не сохраняются**.
3. **Cookies и localStorage** — `useCookie`/`useLocalStorage`/`useState` во фронтенде (`rg "useCookie|useLocalStorage|localStorage|sessionStorage|document.cookie" frontend/app`). Атрибуты cookie (`HttpOnly`, `Secure`, `SameSite`) в [core/session/store/useAuthStore.ts](frontend/app/core/session/store/useAuthStore.ts).
4. **Сторонние сервисы и трекеры** — `rg -i "gtag|analytics|googletagmanager|facebook|fbq|pixel|hotjar|sentry|mixpanel|clarity|useScript"` по `frontend/` и `nuxt.config.ts`. Любой новый внешний получатель данных.
5. **Логирование секретов** — убедись, что токены/`Authorization`/OAuth-коды не утекают в логи (nginx-редирект через `#hash`, а не `?query`; `console.error` не печатает объекты ошибок целиком).

## Шаг 2. Сверить с текущими текстами

Сравни найденное с [frontend/app/pages/privacy.vue](frontend/app/pages/privacy.vue) и текстом согласия в [features/auth/components/LoginPanel.vue](frontend/app/features/auth/components/LoginPanel.vue). Составь короткий список расхождений (что в коде появилось/исчезло, а на странице не отражено — и наоборот).

## Шаг 3. Обновить

- Приведи разделы `/privacy` в соответствие: собираемые данные, scopes/данные Google, cookies, использование, сроки хранения, удаление аккаунта.
- Обнови дату в поле «Дата останнього оновлення» на актуальную (спроси у пользователя или используй сегодняшнюю).
- Если появился **необязательный трекер/аналитика/пиксель** — сначала **предложи удалить его**, а не описывать; сложную систему согласий не строй.
- Если добавились только необходимые для входа/безопасности cookies — cookie-баннер **не создавай**.
- Согласие на маркетинг **не добавляй**.
- **Не придумывай** имя/контакты автора — сохраняй существующие плейсхолдеры (`[ВАШЕ ІМ'Я АБО НІКНЕЙМ]`, `[ВАШ EMAIL ДЛЯ ЗВ'ЯЗКУ]`), если пользователь явно не дал значения.
- Язык страницы — украинский (как весь UI приложения).
- Если менялись DTO/эндпоинты — учти, что типы регенерируются автоматически в `make precommit`.

## Шаг 4. Проверить

Запусти `make precommit` из корня проекта и исправь все ошибки перед ответом.

## Шаг 5. Отчитаться

Кратко покажи: список расхождений, что изменил (со ссылками на файлы), что оставил без изменений и почему, и что пользователю нужно доделать руками (плейсхолдеры, настройки Google Cloud Console, юридическая сверка). **Не утверждай полное соответствие законам** — только разумный технический минимум.
