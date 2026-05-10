# CMS: Strapi — інтеграція контенту

Мета: винести всі захардкоджені UI-тексти з фронтенду в Strapi CMS.
Адмінка дозволяє редагувати тексти без деплою. Фронтенд отримує їх через
Strapi Content API при старті.

---

## Архітектура

```
Strapi Admin UI
      │  редагує контент
      ▼
  PostgreSQL (спільна БД проекту, окрема схема strapi_*)
      │
  Strapi API  →  GET /api/global-ui?locale=uk
      │
  Nuxt (@nuxtjs/i18n custom loader)
      │
  Vue компоненти через $t('key')
```

Strapi підключається до **існуючого** PostgreSQL контейнера — окремої БД
не потрібно. Бекапи покриваються існуючим `StorageDbBackupsService`.

---

## Strapi Single Types (колекції)

### `global-ui`
Глобальні UI елементи — хедер, сайдбар, базові компоненти.

| Поле | Приклад значення |
|---|---|
| `headerCaption` | Панель навчання |
| `headerFocusMode` | Focus mode |
| `sidebarNavHeading` | Навігація |
| `sidebarTipTitle` | Ритм дня |
| `sidebarTipText` | Почни з карток, а потім перевір прогрес у статистиці. |
| `filePickerPrompt` | Натисніть, щоб вибрати або завантажити зображення |
| `filePickerChange` | Змінити |
| `filePickerEmpty` | Зображення не вибране |
| `navHome` | Головна |
| `navFolders` | Папки |
| `navCards` | Картки |
| `navStatistic` | Статистика |
| `navPeoples` | Люди |

### `login-page`
Маркетинговий контент на сторінці входу.

| Поле | Приклад значення |
|---|---|
| `heroTitle` | Вікторини, які хочеться проходити до кінця |
| `heroSubtitle` | Обирай улюблені теми, відповідай швидше... |
| `loginEyebrow` | Вхід |
| `loginTitle` | Продовжити в QuizPet |
| `loginDescription` | Авторизуйся через Google, щоб зберегти прогрес... |
| `ctaGoogle` | Продовжити з Google |
| `ctaBack` | Повернутися на головну |
| `stat1Value` | 200+ |
| `stat1Label` | готових квізів |
| `stat2Value` | Live |
| `stat2Label` | рейтинги та дуелі |
| `stat3Value` | Sync |
| `stat3Label` | прогрес між пристроями |

### `cards-forms`
Лейбли, описи і плейсхолдери форм карток та наборів.

| Поле | Приклад значення |
|---|---|
| `setNameLabel` | Назва модуля |
| `setNameDescription` | Користувачі побачать її у списку ваших наборів. |
| `setNamePlaceholder` | Наприклад, Basic Biology |
| `setTopicLabel` | Тематика модуля |
| `setTopicDescription` | Це допоможе зрозуміти, до якої сфери належить набір. |
| `setTopicSearchPlaceholder` | Знайти тематику |
| `setDescriptionLabel` | Опис |
| `setDescriptionDescription` | Короткий контекст допоможе швидше зрозуміти тему набору. |
| `setDescriptionPlaceholder` | Опишіть, для кого цей набір і що саме він покриває |
| `setEyebrowCreate` | Новий набір |
| `setEyebrowEdit` | Редагування набору |
| `cardTermLabel` | Термін |
| `cardTermDescription` | Коротке слово, поняття або питання. |
| `cardTermPlaceholder` | Наприклад, Photosynthesis |
| `cardTermDescLabel` | Опис терміна |
| `cardTermDescDescription` | Коротке пояснення, підказка або уточнення до терміна. |
| `cardDefinitionLabel` | Визначення |
| `cardDefinitionDescription` | Пояснення, переклад або правильна відповідь. |
| `cardDefinitionPlaceholder` | Опишіть значення або дайте відповідь |
| `cardTextColorLabel` | Колір тексту |
| `cardTextColorDescription` | Впливає на читабельність та контраст. |
| `cardBgColorLabel` | Колір фону |
| `cardBgColorDescription` | Фон картки краще робити м'яким, щоб текст залишався помітним. |

### `learn-ui`
Тексти навчального режиму — прогрес, результати, статуси.

| Поле | Приклад значення |
|---|---|
| `progressMastered` | Засвоєно |
| `progressRetry` | Повторення після помилок |
| `progressStatQueue` | У черзі |
| `progressStatErrors` | Помилок |
| `progressStatCard` | Ця картка |
| `progressStatSession` | Весь сеанс |
| `progressEmptyTitle` | Немає карток для проходження |
| `progressEmptyDescription` | Додайте щонайменше дві картки в набір, щоб почати навчання. |
| `progressRunningDescription` | Поки йдете без помилок. За потреби перевертайте картку... |
| `resultsStatAccuracyLabel` | Точність |
| `resultsStatAccuracyDesc` | Частка вдалих відповідей серед усіх натискань на кнопки оцінки. |
| `resultsStatFirstLabel` | З першого разу |
| `resultsStatFirstDesc` | Скільки карток були впізнані без повернення в повторення. |
| `resultsStatTimeLabel` | Загальний час |
| `resultsStatTimeDesc` | Увесь час поточного навчального сеансу. |
| `resultsStatAvgLabel` | Середній час |
| `resultsStatAvgDesc` | Орієнтир, скільки в середньому йшло на одну картку. |
| `resultsPerfect` | Ідеальний прохід без помилок |
| `resultsCompleted` | Сеанс завершено, є що закріпити |
| `resultsPerfectDesc` | Усі картки були закриті без промахів... |
| `resultsNoErrors` | Без помилок |
| `resultsEmpty` | Підсумок з'явиться після проходження |

---

## План виконання

### Крок 1 — Strapi в Docker Compose
- Додати сервіс `strapi` в `compose.yaml`
- Підключити до існуючого PostgreSQL (окрема база `strapi` або префікс таблиць)
- Додати `STRAPI_*` змінні в `.env`
- Додати `strapi-data` volume для uploads

### Крок 2 — Strapi налаштування
- Запустити `make dev`, відкрити Strapi Admin
- Встановити плагін `@strapi/plugin-i18n`
- Створити Single Types: `global-ui`, `login-page`, `cards-forms`, `learn-ui`
- Додати поля згідно таблиць вище
- Увімкнути локалізацію `uk` на всіх типах
- Заповнити контент — перенести всі тексти з коду
- Відкрити публічний доступ до `find` endpoints (Settings → Roles → Public)

### Крок 3 — Фронтенд: встановлення i18n
```bash
cd frontend
npm install @nuxtjs/i18n
```
- Додати модуль в `nuxt.config.ts`
- Налаштувати `defaultLocale: 'uk'`
- Написати custom loader що робить fetch до Strapi API

### Крок 4 — Фронтенд: repository шар
- Створити `app/repository/cms.ts` — функції для отримання кожного Single Type
- Додати до `$api` плагіну

### Крок 5 — Фронтенд: заміна хардкоду
Для кожного компоненту — замінити рядки на `$t('key')`:
- [ ] `AppHeader.vue`
- [ ] `AppSidebar.vue`
- [ ] `BaseFilePicker.vue`
- [ ] `pages/login/index.vue`
- [ ] `features/cards/components/SetForm.vue`
- [ ] `features/cards/components/CardForm.vue`
- [ ] `features/cards/components/learn/LearnProgress.vue`
- [ ] `features/cards/components/learn/LearnResults.vue`

### Крок 6 — Prod
- Додати Strapi в `compose.prod.yaml`
- Переконатись що бекапи PostgreSQL покривають strapi таблиці (вже є)
- Додати `STRAPI_URL` до env prod

---

## Змінні середовища (додати в `.env`)

```env
# Strapi
STRAPI_PORT=1337
STRAPI_APP_KEYS=key1,key2,key3,key4
STRAPI_API_TOKEN_SALT=salt
STRAPI_ADMIN_JWT_SECRET=secret
STRAPI_JWT_SECRET=secret
STRAPI_DB_NAME=strapi

# Frontend (для Nuxt)
NUXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## Нотатки

- Strapi використовує окрему базу (`strapi`) всередині того самого PostgreSQL контейнера — `CREATE DATABASE strapi` при першому запуску
- Strapi Admin доступний на `http://localhost:1337/admin`
- Content API: `GET http://localhost:1337/api/global-ui?locale=uk&populate=*`
- При зміні контенту в Strapi — фронтенд підхопить при наступному SSR або після ручного `revalidate`
