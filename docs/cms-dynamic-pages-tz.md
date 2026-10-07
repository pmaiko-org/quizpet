# ТЗ: динамические страницы и контент в Strapi CMS

**Статус:** готово к реализации
**Актуализировано:** 2026-10-07

---

## 1. Цель

Перевести фронтенд на модель, при которой **весь контент и структура страниц управляются из админки Strapi без деплоя**:

1. Два языка сайта (украинский, английский) с переключателем.
2. Все страницы — динамические, собираются из виджетов в админке.
3. Каждая страница имеет собственные SEO-данные.
4. Глобальные данные (меню, логотип, футер) — в CMS.
5. Любой текст интерфейса меняется в админке.
6. Каждая страница помечается признаком доступа: для гостей или для залогиненных.
7. На каждой странице отображаются хлебные крошки.

### Критерий готовности

В каталоге `frontend/app/pages/` остаётся **один файл** — `[...slug].vue`. Любая страница, её адрес, содержимое, язык, SEO, иерархия хлебных крошек и правила доступа создаются и меняются в админке.

---

## 2. Что НЕ входит в работу

| Исключение                                                                         | Причина                                                                     |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Вопросы «Пітаньячка» (`backend/src/features/pitanyachka/pitanyachka.questions.ts`) | Решение заказчика — не трогать                                              |
| `PitanyachkaGateway`, WebSocket-логика игры                                        | Не трогаем                                                                  |
| Справочники `topics`, `english-levels`                                             | Связаны внешними ключами с `sets` в БД бэкенда; перенос нарушит целостность |
| Пользовательский контент (наборы, карточки, профили)                               | Остаётся в NestJS                                                           |
| Авторизация, JWT, Google OAuth                                                     | Не меняется                                                                 |

Страница `/cabinet/pitanyachka` при этом **становится динамической** — но внутрь неё встраивается существующий `PitanyachkaWidget` без изменений.

---

## 3. Зафиксированные решения заказчика

| №   | Решение                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------- |
| 1   | Языки: `uk` (основной, без префикса) + `en` (`/en/...`)                                              |
| 2   | Публичные страницы индексируются; доступ задаётся отдельно для каждой страницы                       |
| 3   | Тексты интерфейса — **только в CMS**, локальных JSON-файлов с переводами нет                         |
| 4   | В CMS создаются только виджеты, необходимые для переноса существующих страниц                        |
| 5   | Захардкоженных страниц во фронте не остаётся                                                         |
| 6   | Признак доступа — на каждой странице                                                                 |
| 7   | Хлебные крошки — на каждой странице                                                                  |
| 8   | Сид содержит полноценные украинские и английские тексты                                              |
| 9   | SVG разрешён для логотипа; на сайте он выводится только через `<img>`                                |
| 10  | Маршрут `/hovermap` удаляется                                                                        |
| 11  | `/` — публичный лендинг; кабинет и все его страницы находятся под `/cabinet/*`                       |
| 12  | Устаревший `docs/cms-strapi.md` удаляется                                                            |
| 13  | В production работают две реплики Nuxt; кеш инвалидируется webhook + version-key в Redis без Pub/Sub |

---

## 4. Архитектура

```
         Strapi Admin (/cms/admin)
                  │
                  ▼
      PostgreSQL, база "cms" (отдельная от БД бэкенда)
                  │
   ┌──────────────┴───────────────┐
   │   Strapi Content API         │
   │   /api/bootstrap             │  словарь + маршруты + global
   │   /api/pages/resolve         │  разрешение пути → страница
   └──────────────┬───────────────┘
                  │  (SSR: напрямую по docker-сети)
                  ▼
         reverse proxy / Docker DNS
             ┌────┴────┐
             ▼         ▼
          Nuxt #1   Nuxt #2
      pages/[...slug].vue + маппер виджетов
                  │
                  ▼
        Существующие Base* и widgets/
```

Обе реплики используют общий Redis и отдельные снимки в памяти Nitro.

---

## 5. Схемы Strapi

### 5.1 Компоненты категории `shared`

Переиспользуемые кирпичики, не появляются в Dynamic Zone напрямую.

**`shared.seo`**

| Поле              | Тип            | Параметры              |
| ----------------- | -------------- | ---------------------- |
| `metaTitle`       | Text           | required, max 60       |
| `metaDescription` | Text (long)    | required, max 160      |
| `ogImage`         | Media (single) | рекомендовано 1200×630 |
| `canonicalUrl`    | Text           | —                      |
| `noIndex`         | Boolean        | default false          |

**`shared.link`**

| Поле         | Тип               | Параметры                                |
| ------------ | ----------------- | ---------------------------------------- |
| `label`      | Text              | required                                 |
| `page`       | Relation → `page` | внутренняя ссылка                        |
| `url`        | Text              | внешняя ссылка                           |
| `isExternal` | Boolean           | default false                            |
| `icon`       | Text              | имя lucide-иконки, напр. `i-lucide-home` |

Два поля для адреса намеренно: `page` переживает смену пути, `url` — для внешних ресурсов.

Итого: **2 компонента `shared`**.

### 5.2 Компоненты категории `sections` — виджеты

Каждый элемент Dynamic Zone — отдельный компонент Strapi, который напрямую
соответствует одному Vue-виджету; поля-enum и второго уровня диспетчеризации нет.

| Display name в CMS   | API ID                 | Strapi UID (`__component`)      | Vue-компонент       | Поля CMS                                                           | Параметр маршрута |
| -------------------- | ---------------------- | ------------------------------- | ------------------- | ------------------------------------------------------------------ | ----------------- |
| Heading Widget       | `heading-widget`       | `sections.heading-widget`       | `HeadingWidget`     | `eyebrow`, `title`, `summary`, `align`                             | —                 |
| Rich Text Widget     | `rich-text-widget`     | `sections.rich-text-widget`     | `RichTextWidget`    | `body`, `width`                                                    | —                 |
| Callout Widget       | `callout-widget`       | `sections.callout-widget`       | `CalloutWidget`     | `title`, `body`, `variant`, `icon`, `primaryLink`, `secondaryLink` | —                 |
| Home Widget          | `home-widget`          | `sections.home-widget`          | `HomeWidget`        | —                                                                  | —                 |
| Login Widget         | `login-widget`         | `sections.login-widget`         | `LoginWidget`       | —                                                                  | —                 |
| People Hero Widget   | `people-hero-widget`   | `sections.people-hero-widget`   | `PeopleHeroWidget`  | —                                                                  | —                 |
| People Grid Widget   | `people-grid-widget`   | `sections.people-grid-widget`   | `PeopleGridWidget`  | —                                                                  | —                 |
| Pitanyachka Widget   | `pitanyachka-widget`   | `sections.pitanyachka-widget`   | `PitanyachkaWidget` | —                                                                  | —                 |
| Profile Widget       | `profile-widget`       | `sections.profile-widget`       | `ProfileWidget`     | —                                                                  | —                 |
| Sets List Widget     | `sets-list-widget`     | `sections.sets-list-widget`     | `SetsListWidget`    | —                                                                  | —                 |
| Create Set Widget    | `create-set-widget`    | `sections.create-set-widget`    | `CreateSetWidget`   | —                                                                  | —                 |
| Set Edit Form Widget | `set-edit-form-widget` | `sections.set-edit-form-widget` | `SetEditFormWidget` | —                                                                  | `:id`             |
| Learn Widget         | `learn-widget`         | `sections.learn-widget`         | `LearnWidget`       | —                                                                  | `:id`             |
| Match Widget         | `match-widget`         | `sections.match-widget`         | `MatchWidget`       | —                                                                  | `:id`             |

#### Единый контракт именования виджетов

Каноническое имя задаётся как смысловая часть в kebab-case без суффикса, например
`people-hero`. Все остальные имена выводятся из неё механически:

| Где                         | Формат                         | Пример для `people-hero`                              |
| --------------------------- | ------------------------------ | ----------------------------------------------------- |
| Display name в Strapi       | `<Words> Widget`               | `People Hero Widget`                                  |
| API ID                      | `<kebab-name>-widget`          | `people-hero-widget`                                  |
| Strapi UID / `__component`  | `sections.<kebab-name>-widget` | `sections.people-hero-widget`                         |
| Файл схемы Strapi           | `<api-id>.json`                | `cms/src/components/sections/people-hero-widget.json` |
| Vue-компонент и имя файла   | `<PascalName>Widget`           | `PeopleHeroWidget.vue`                                |
| Ключ frontend-реестра       | точный Strapi UID              | `sections.people-hero-widget`                         |
| Литерал в Zod/OpenAPI union | точный Strapi UID              | `sections.people-hero-widget`                         |
| Ссылка в seed страницы      | точный Strapi UID              | `sections.people-hero-widget`                         |

Обязательные правила:

- все компоненты категории `sections` заканчиваются на `-widget`, а соответствующие Vue-компоненты — на `Widget`;
- префикс `Cms` не используется ни в Strapi, ни во Vue;
- короткий API ID используется только как имя schema-файла и в колонке API ID; в Dynamic Zone, контрактах, frontend-реестре и seed всегда используется полный UID `sections.*`;
- после публикации UID считается стабильным. Переименование Display name допустимо, а смена UID выполняется только через новый компонент, миграцию всех `blocks` и последующее удаление старого компонента;
- обычные внутренние Vue-компоненты не регистрируются в CMS. В CMS попадают только page-level виджеты, которые разрешено добавлять в Dynamic Zone страницы.

Существующий `SetEditHeroWidget.vue` не используется ни одной страницей и не входит
в Dynamic Zone. Он и обслуживающий его `SetEditHero.vue` удаляются на этапе очистки;
CMS-компонент `sections.set-edit-hero-widget` для них не создаётся.

Добавляется команда `npm --prefix ./cms run check:widgets`. Она проверяет равенство
набора UID в `cms/src/components/sections/*.json`, разрешённых компонентов Dynamic
Zone, литералов Zod `blocks` union и ключей frontend-реестра, а также проверяет
Display name, API ID, имя Vue-файла и все ссылки из seed по правилам выше. Лишнее или
отсутствующее имя завершает проверку ошибкой. Команда входит в корневой
`make precommit`; сгенерированные OpenAPI и TypeScript-типы дополнительно проверяются
на незакоммиченный diff после `generate:cms-types`.

Поля контентных виджетов:

| Компонент                   | Поля                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sections.heading-widget`   | `eyebrow`, `title`, `summary`, `align` (enum: `left`/`center`)                                                                                         |
| `sections.rich-text-widget` | `body` (Blocks), `width` (enum: `narrow`/`default`/`full`)                                                                                             |
| `sections.callout-widget`   | `title`, `body` (Blocks), `variant` (enum: `info`/`success`/`warning`/`error`), `icon`, `primaryLink` (`shared.link`), `secondaryLink` (`shared.link`) |

Файл схемы строится из API ID: `cms/src/components/sections/<api-id>.json`.
Три контентных Vue-компонента создаются в
`frontend/app/features/cms/components/sections/`. Функциональные виджеты уже
существуют; `HomeWidget` извлекается из текущей авторизованной главной страницы и
переносится на `/cabinet` без изменения поведения. Публичный лендинг `/` собирается
из трёх контентных виджетов. У функциональных компонентов нет полей CMS: сам факт их
добавления в Dynamic Zone определяет состав и порядок страницы, а тексты их
интерфейса берутся из `translation`.

Итого: **14 компонентов `sections`**. Новые типы добавляются только при появлении
подтверждённого сценария, который нельзя собрать из этих компонентов.

### 5.3 Collection type `page`

| Поле         | Тип                         | Локализуемое | Параметры                                          |
| ------------ | --------------------------- | ------------ | -------------------------------------------------- |
| `title`      | Text                        | да           | required                                           |
| `path`       | Text                        | да           | required, unique в рамках локали                   |
| `routeName`  | Text                        | **нет**      | required, unique, kebab-case                       |
| `access`     | Enumeration                 | нет          | `public` / `authenticated` / `guestOnly`           |
| `redirectTo` | Relation → `page`           | нет          | куда отправлять при отказе                         |
| `parent`     | Relation → `page`           | да           | родительская страница для хлебных крошек, optional |
| `layout`     | Enumeration                 | нет          | `default` / `cabinet` / `empty`                    |
| `blocks`     | Dynamic Zone (`sections.*`) | да           | —                                                  |
| `seo`        | Component `shared.seo`      | да           | required                                           |
| `priority`   | Integer                     | нет          | default 0                                          |

Draft & Publish: **включён**. Локализация: **включена**.

**Правила:**

- `path` начинается со `/`, параметры в формате `:name` — например `/cabinet/sets/:id/learn`.
- `routeName` не локализуется: это стабильный идентификатор для построения ссылок в коде (замена enum `RouteName`).
- `path` локализуется и хранится без языкового префикса: например `/pro-nas` для `uk` и `/about-us` для `en`. Публичный префикс `/en` добавляет Nuxt по стратегии `prefix_except_default`; для функциональных маршрутов значение `path` в обеих локалях может совпадать.
- Если `access` ≠ `public`, при отдаче SEO принудительно выставляется `noIndex: true`.
- `redirectTo` по умолчанию: `login` для `authenticated`, `cabinet` для `guestOnly`.
- Хлебные крошки строятся из цепочки `parent` и текущей страницы; отдельный виджет Strapi для них не создаётся.
- Для параметризованных страниц заголовки хлебных крошек остаются статическими и берутся из CMS. Данные сущностей NestJS, например название набора по `:id`, в цепочку не добавляются.
- У страницы без `parent` цепочка состоит из одного текущего пункта. Циклические связи запрещены; `resolve` проверяет цикл и ограничивает глубину цепочки десятью уровнями.
- Если путь родителя содержит параметры, все они должны присутствовать и в пути дочерней страницы, чтобы `resolve` мог построить ссылку.

### 5.4 Collection type `translation`

| Поле        | Тип         | Локализуемое | Параметры                                             |
| ----------- | ----------- | ------------ | ----------------------------------------------------- |
| `key`       | Text        | **нет**      | required, unique, точечная нотация                    |
| `value`     | Text (long) | да           | required                                              |
| `context`   | Text        | нет          | подсказка переводчику                                 |
| `namespace` | Text        | нет          | группировка для админки: `common`, `sets`, `learn`, … |

Пример: `key = "sets.form.name.label"`, `value(uk) = "Назва модуля"`, `value(en) = "Module name"`.

`value` поддерживает именованную интерполяцию и плюрализацию Vue I18n, например
`Вітаємо, {name}` и `{count} модуль | {count} модулі | {count} модулів`. Имена
параметров являются частью контракта ключа и должны совпадать во всех локалях.
HTML в значениях переводов не используется.

Draft & Publish: **выключен** (переводы публикуются сразу).

### 5.5 Collection type `redirect`

| Поле         | Тип         | Параметры                    |
| ------------ | ----------- | ---------------------------- |
| `from`       | Text        | required, unique             |
| `to`         | Text        | required                     |
| `statusCode` | Enumeration | `301` / `302`, default `301` |

Нужен, чтобы смена `path` опубликованной страницы не ломала внешние ссылки и позиции в поиске.
`from` и `to` содержат полный публичный путь, включая `/en` для английской версии.

### 5.6 Single type `global`

| Поле            | Тип                      | Локализуемое |
| --------------- | ------------------------ | ------------ |
| `siteName`      | Text                     | да           |
| `defaultSeo`    | `shared.seo`             | да           |
| `logo`          | Media                    | нет          |
| `favicon`       | Media                    | нет          |
| `sidebarLinks`  | repeatable `shared.link` | да           |
| `footerLinks`   | repeatable `shared.link` | да           |
| `socialLinks`   | repeatable `shared.link` | нет          |
| `footerTagline` | Text                     | да           |

Сюда переезжают `PROJECT_LINKS` из `frontend/app/shared/constants.ts` и пункты меню из `TheSidebar.vue`.

В `cms/config/plugins.ts` разрешается загрузка SVG для логотипа. На фронтенде SVG
отдаётся только как URL через `<img>`/`NuxtImg`; содержимое файла не вставляется в
DOM через `v-html` или inline SVG.

---

## 6. API: кастомные эндпоинты Strapi

Штатного REST недостаточно по трём причинам: лимит `maxLimit: 100` в `config/api.ts`, громоздкий `populate` для Dynamic Zone и `strictParams: true`, не прощающий опечаток.

### 6.1 `GET /api/bootstrap?locale=uk`

Один запрос на старте SSR вместо трёх.

```jsonc
{
  "locale": "uk",
  "translations": { "sets.form.name.label": "Назва модуля" },
  "routes": [
    {
      "routeName": "sets-id-learn",
      "path": "/cabinet/sets/:id/learn",
      "access": "authenticated",
    },
  ],
  "global": {},
}
```

Реестр `routes` содержит только метаданные — без блоков, чтобы ответ оставался компактным.
Значения `path` в `bootstrap.routes` не содержат языковой префикс.

### 6.2 `GET /api/pages/resolve?path=/cabinet/sets/42/learn&locale=uk`

```jsonc
{
  "page": {
    "routeName": "sets-id-learn",
    "layout": "cabinet",
    "access": "authenticated",
    "seo": {},
    "breadcrumbs": [
      { "title": "Головна", "path": "/" },
      { "title": "Кабінет", "path": "/cabinet" },
      { "title": "Модулі", "path": "/cabinet/sets" },
      { "title": "Навчання", "path": "/cabinet/sets/42/learn" },
    ],
    "blocks": [],
  },
  "params": { "id": "42" },
}
```

**Алгоритм сопоставления:**

1. Точное совпадение пути без параметров — выигрывает всегда.
2. Иначе — сопоставление по паттерну, при этом сортировка: больше статических сегментов → выше; при равенстве решает `priority`.
3. Ничего не найдено → страница с `routeName: not-found`, код ответа 404.
4. Для найденной страницы строится локализованная цепочка `breadcrumbs` из её родителей; в параметризованные пути подставляются фактические параметры запроса. Поле `path` каждой крошки содержит готовый публичный URL с `/en` для английской локали.

### 6.3 Preview черновиков

Для `page` настраивается штатная функция Preview Strapi. Preview handler формирует
ссылку на серверный endpoint Nuxt `/api/preview` с `path`, `locale`, `status` и
короткоживущим HMAC-токеном, подписанным общим preview-секретом. Сам секрет в URL не
передаётся. Endpoint проверяет подпись и срок токена, разрешает только локальный
абсолютный путь, устанавливает подписанную `HttpOnly`, `SameSite=Lax` cookie
(`Secure` в production) и перенаправляет на страницу уже без токена в URL. Отдельный
endpoint выхода из Preview удаляет cookie.

В `cms/config/admin.ts` Preview включается только для `page`, а `allowedOrigins`
ограничивается origin фронтенда. CSP фронтенда разрешает `frame-ancestors` только для
origin админки Strapi. В объём входит обычный Preview; платный Live Preview и
редактирование Dynamic Zone внутри preview-окна не входят.

В Preview-режиме Nuxt вызывает `resolve` со `status=draft`. Такой запрос принимается
только с серверным preview-секретом в отдельном заголовке; публичный вызов `resolve`
всегда возвращает опубликованную версию. В Strapi 5 черновик выбирается через
`status: "draft"`, а не через устаревший `publicationState`. Preview-запросы полностью
обходят кеш Nitro и Redis и получают `noIndex: true`. Секрет и содержимое cookie не
попадают в клиентский runtime config, HTML или ключ `useAsyncData`.

### 6.4 `GET /api/redirects`

Плоский список для middleware. Кешируется вместе с bootstrap.

### 6.5 Доступ

Опубликованные данные `bootstrap`, `resolve` и `redirects` доступны роли Public только
на чтение. Ветка `resolve` с `status=draft` требует серверный preview-секрет и не
доступна прямому запросу браузера. Запись — только через админку.

---

## 7. Фронтенд

### 7.1 Единственная страница

`frontend/app/pages/[...slug].vue`:

1. Определяет текущую локаль, удаляет из URL её служебный префикс и получает нормализованный locale-relative путь для `resolve`.
2. Берёт `bootstrap` (из кеша) и вызывает `resolve` через `useAsyncData` с реактивным ключом `cms-page:${locale}:${normalizedPath}:${previewStatus}`; query-параметры в ключ не входят.
3. Проверяет `access`, при отказе — редирект на `redirectTo`.
4. Применяет `layout` через `setPageLayout`.
5. Ставит SEO через `useSeoMeta` + hreflang.
6. Рендерит `BaseBreadcrumbs` из готовой цепочки `page.breadcrumbs`.
7. Рендерит `blocks` через маппер.

### 7.2 Маппер виджетов

`frontend/app/features/cms/` — новая фича по правилам слоёв из `frontend/CLAUDE.md`:

```
features/cms/
  components/sections/   — 3 Vue-компонента контента
  composables/useCmsPage.ts
  composables/usePageRoutes.ts
  types.ts
```

Реестр `__component` → Vue-компонент из таблицы 5.2 хранится в `[...slug].vue`.
Контентные блоки сопоставляются с компонентами из `features/cms`, функциональные
блоки — с существующими виджетами доменных фич. Такое расположение сохраняет
правило слоёв: страница может компоновать несколько фич, а фича `cms` не
импортирует соседние фичи. Неизвестный `__component` логируется и пропускается,
страница не падает.

### 7.3 Хлебные крошки

`frontend/app/shared/components/base/BaseBreadcrumbs.vue` принимает готовый массив
`{ title, path }[]` и отображает его через `UBreadcrumb`. Последний пункт обозначается
как текущий (`aria-current="page"`) и не является ссылкой. Компонент выводится на
каждой странице перед `blocks`; страницы без родителя показывают один текущий пункт.

Названия и пути формирует `resolve`, поэтому фронтенд не восстанавливает иерархию и
не обращается к CMS за каждым предком. Для текущей страницы используется фактически
разрешённый URL, а не шаблон с `:param`.

Крошки параметризованной страницы содержат статические названия из CMS: например,
`Головна → Кабінет → Модулі → Навчання`. Название конкретного набора из NestJS в них
не подставляется, поэтому функциональным виджетам не нужен канал переопределения крошек.

### 7.4 Параметры маршрута в виджетах

`params` из `resolve` кладутся в `provide`/`inject`. Целевой функциональный
виджет берёт нужный параметр; например, `sections.learn-widget` получает
`setId` из `params.id`.

### 7.5 Контроль доступа

Глобальный middleware переписывается: вместо жёсткого списка `PUBLIC_PATHS` из `redirect.global.ts` правило берётся из `access` разрешённой страницы.

| `access`        | Гость                                           | Залогинен                                         |
| --------------- | ----------------------------------------------- | ------------------------------------------------- |
| `public`        | показать                                        | показать                                          |
| `authenticated` | редирект на `redirectTo` (по умолчанию `login`) | показать                                          |
| `guestOnly`     | показать                                        | редирект на `redirectTo` (по умолчанию `cabinet`) |

Проверка выполняется на SSR до рендера блоков — чтобы приватный контент не мелькал перед редиректом.

> **Важно:** `access` — это навигация, а не безопасность. Реальная защита данных остаётся на бэкенде (JWT в NestJS). Содержимое блоков приватной страницы технически доступно через публичный API Strapi, поэтому секретов в контенте быть не должно.

### 7.6 i18n

- Ставится `@nuxtjs/i18n` (сейчас отсутствует в зависимостях).
- `defaultLocale: "uk"`, `strategy: "prefix_except_default"` → `/` и `/en/...`.
- Сообщения берутся **только** из `bootstrap.translations`, локальных файлов локалей нет.
- Полученный словарь устанавливается в Vue I18n через `setLocaleMessage` до рендера страницы, без собственной реализации шаблонов; поддерживаются именованная интерполяция и плюрализация средствами Vue I18n.
- Если ключ отсутствует, в development отображается `[NO_TRANSLATION: key]`; в production — сам `key`, а ошибка логируется без повторного спама для одного ключа.
- Переключатель языка получает локализованный `path` текущей страницы из реестра и добавляет префикс по правилам `prefix_except_default`; если перевода страницы нет — ведёт на главную соответствующей локали.
- `htmlAttrs.lang` проставляется динамически вместо текущего жёсткого `lang="uk"` в `nuxt.config.ts`.

### 7.7 Замена `RouteName`

Enum `RouteName` из `shared/constants.ts` удаляется — именованных маршрутов больше нет. Вместо него:

```ts
const routes = usePageRoutes();
routes.resolve("sets-id-learn", { id: setId }); // → "/cabinet/sets/42/learn"
```

Резолвер работает по реестру из `bootstrap`, учитывает текущую локаль и добавляет
языковой префикс к итоговому публичному URL. Все `:to="{ name: RouteName.X }"` в коде
заменяются на него.
Ссылки, которые раньше вели на авторизованную главную `index`, переводятся на
`cabinet`; `index` теперь всегда означает публичный лендинг `/`.

Если `routeName` отсутствует или переданы не все параметры, резолвер бросает ошибку в
development. В production он логирует ошибку и возвращает локализованный путь страницы
`not-found`, чтобы не создавать ссылку с необработанным `:param`.

Также отключается `experimental.typedPages` — типизировать нечего, маршрут один.

### 7.8 Автогенерация TypeScript-типов

У Strapi нет готового стабильного генератора типов HTTP-ответов для внешнего
фронтенда. Штатный `strapi ts:generate-types` создаёт типы схем для кода самого
Strapi, а встроенный генератор OpenAPI пока помечен как experimental. Поэтому
используются оба механизма, каждый для своей задачи.

**В CMS:**

1. `strapi ts:generate-types` генерирует
   `cms/types/generated/{contentTypes,components}.d.ts` из JSON-схем Strapi.
2. Эти файлы используются контроллерами и сервисами CMS, но напрямую во фронтенд
   не импортируются: они содержат внутреннюю module augmentation Strapi и не
   описывают итоговую форму кастомных ответов.
3. Для `bootstrap`, `resolve` и `redirects` рядом с маршрутами объявляются Zod-схемы
   `request`/`response` со стабильными именами. `zod` добавляется как прямая
   зависимость CMS. Один и тот же контракт используется для типизации контроллера
   через `z.infer` и встроенным генератором OpenAPI.
4. `strapi openapi generate` сохраняет спецификацию в
   `cms/openapi.json`. HTTP-доступ к полной спецификации в production не включается.

**Во фронтенде:**

1. Уже используемый `openapi-typescript` преобразует `cms/openapi.json` в
   `frontend/app/features/cms/types/api.generated.ts`.
2. Файл полностью генерируемый и вручную не редактируется.
3. Скрипт добавляет только удобные публичные type aliases с префиксом `T`, например
   `TCmsBootstrapResponse`, `TCmsPageResolveResponse` и `TCmsRedirectsResponse`.
4. Тип `blocks` должен получиться дискриминированным union по литеральному полю
   `__component`; реестр виджетов проверяется через `satisfies` на полноту этого union.

Автоматическую OpenAPI-схему стандартного REST-маршрута `page` не используем как
контракт фронтенда: генератор Strapi может потерять структуру Dynamic Zone и выдать
для `blocks` пустой объект. Полный union всех 14 виджетов явно описывается в
`response`-схеме маршрута `resolve`, поэтому именно она является публичным API-контрактом.

Добавляется единая команда `generate:cms-types`:

```text
Strapi JSON schemas → strapi ts:generate-types → типы внутри CMS
Zod request/response schemas
  → strapi openapi generate
  → cms/openapi.json
  → openapi-typescript
  → frontend/app/features/cms/types/api.generated.ts
```

`cms/openapi.json` и итоговый TypeScript-файл коммитятся. Команда запускается после
каждого изменения схемы или контракта и в CI; CI завершает проверку ошибкой, если
после генерации появился незакоммиченный diff. Для запуска OpenAPI-генератора Strapi
нужна доступная CMS-база PostgreSQL.

---

## 8. Кеширование и отказоустойчивость

Поскольку локальных переводов нет, недоступность Strapi не должна ронять сайт.

| Уровень | Что                                        | TTL                               |
| ------- | ------------------------------------------ | --------------------------------- |
| 1       | Снимок в памяти конкретного Nitro-инстанса | до смены общей версии/перезапуска |
| 2       | Versioned payload в Redis                  | 1 час                             |
| 3       | Запрос в Strapi                            | —                                 |

**Правила:**

- Промах во всех трёх уровнях на старте — приложение не поднимается с явной ошибкой в логе (лучше, чем сайт с голыми ключами).
- Каждый инстанс хранит последний успешно загруженный снимок отдельно от активной версии. Если Strapi отвалился после успешного старта и данные новой версии получить нельзя, используется этот stale-снимок, а в лог пишется предупреждение.
- В production запускаются **два экземпляра Nuxt** за общим reverse proxy.
- Redis Pub/Sub не используется. Единственная точка инвалидации — защищённый webhook `POST /api/_revalidate`.
- При первом старте `cms:content:version` создаётся через `SETNX` со значением `1`.
- Webhook проверяет `NUXT_REVALIDATE_SECRET` и атомарно выполняет `INCR cms:content:version`. В ответе возвращается новая версия.
- `bootstrap` и `resolve` сохраняются в Redis под ключами, содержащими версию: `cms:{version}:bootstrap:{locale}` и `cms:{version}:page:{locale}:{path}`. Старые ключи не удаляются перебором и автоматически исчезают по TTL.
- Перед использованием активного снимка из памяти каждый инстанс читает `cms:content:version`. Если версия отличается от локальной, инстанс помечает снимок устаревшим и получает данные новой версии из Redis или Strapi; последняя успешная копия сохраняется только как `stale-if-error`.
- Инстанс, принявший webhook, сразу помечает и собственный снимок устаревшим; второй сделает это до обработки своего следующего CMS-запроса. При доступных Redis и Strapi запросы, начавшиеся после успешного webhook, не должны получать устаревший снимок.
- После получения данных из Strapi инстанс повторно сверяет version-key. Если версия успела измениться, результат не используется, а чтение один раз повторяется с новой версией. Данные, записанные под старым versioned-ключом параллельным запросом, больше не читаются и исчезают по TTL. Это закрывает гонку публикации с SSR-запросом без распределённой блокировки.
- Webhook настраивается для публикации, снятия с публикации, создания, изменения и удаления `page`, `translation`, `redirect`, `global`, а также изменения используемых media-файлов.
- Если Redis недоступен, чтение может использовать последний локальный снимок, но `_revalidate` отвечает `503` и пишет критическую ошибку: успешную общую инвалидацию без Redis гарантировать нельзя.

### Две реплики в Docker Compose

- У `frontend` удаляется `container_name`, потому что Compose не масштабирует сервис с фиксированным именем контейнера.
- В production-конфигурации Compose для `frontend` задаётся `scale: 2`; development остаётся с одной репликой.
- Обе реплики получают общий network alias `${PROJECT_PREFIX}-frontend` в `shared_network`, поэтому адрес внешнего reverse proxy не меняется.
- Nginx внутри frontend-контейнера проксирует Nitro на `127.0.0.1:5001`, а не на имя конкретного контейнера.
- Внешний reverse proxy использует Docker DNS с повторным разрешением alias после рестарта реплик, healthcheck и переключением на здоровый upstream.
- Реплики не используют sticky sessions: авторизация уже основана на JWT, Preview-cookie проверяется одинаковым секретом, а общее CMS-состояние находится в Redis.

---

## 9. SEO

- `useSeoMeta` из `page.seo`, с подстановкой `global.defaultSeo` для незаполненных полей.
- `hreflang` для обеих локалей + `x-default` — обязательно, иначе поисковик сочтёт версии дублями.
- `canonical` из `seo.canonicalUrl` либо текущий URL.
- `/sitemap.xml` генерируется из реестра маршрутов, в него попадают только `access: public`, `noIndex: false` и пути без параметров `:name`.
- `/robots.txt` отдаётся с учётом окружения.
- Для `authenticated` и `guestOnly` — принудительный `noIndex`.
- Страница `not-found` всегда получает `noIndex: true` и не включается в sitemap.

---

## 10. Миграция контента

Ручное перенесение исключено. Пишется сид-скрипт `cms/scripts/seed.ts`:

1. Создаёт локали `uk` и `en`.
2. Создаёт 15 страниц из реестра ниже, включая новый публичный лендинг и 404, со связями `parent` для хлебных крошек.
3. Заливает ключи переводов, извлечённые из `.vue`-файлов, с полноценными значениями для `uk` и `en`; украинские заглушки в английской локали не используются.
4. Заполняет `global` из `PROJECT_LINKS` и `TheSidebar.vue`.
5. Не создаёт редиректы со старых путей: после переноса они, включая `/hovermap`, возвращают 404.
6. Идемпотентен — повторный запуск не плодит дубли.

### Реестр страниц для сида

| `routeName`     | `path`                    | `parent`  | `access`      | `layout` | `blocks` UID                                                                      |
| --------------- | ------------------------- | --------- | ------------- | -------- | --------------------------------------------------------------------------------- |
| `index`         | `/`                       | —         | **public**    | default  | `sections.heading-widget`, `sections.rich-text-widget`, `sections.callout-widget` |
| `login`         | `/login`                  | `index`   | **guestOnly** | empty    | `sections.login-widget`                                                           |
| `privacy`       | `/privacy`                | `index`   | **public**    | empty    | `sections.heading-widget`, `sections.rich-text-widget`                            |
| `cabinet`       | `/cabinet`                | `index`   | authenticated | cabinet  | `sections.home-widget`                                                            |
| `folders`       | `/cabinet/folders`        | `cabinet` | authenticated | cabinet  | `sections.callout-widget`                                                         |
| `statistic`     | `/cabinet/statistic`      | `cabinet` | authenticated | cabinet  | `sections.callout-widget`                                                         |
| `people`        | `/cabinet/people`         | `cabinet` | authenticated | cabinet  | `sections.people-hero-widget`, `sections.people-grid-widget`                      |
| `pitanyachka`   | `/cabinet/pitanyachka`    | `cabinet` | authenticated | cabinet  | `sections.pitanyachka-widget`                                                     |
| `profile`       | `/cabinet/profile`        | `cabinet` | authenticated | cabinet  | `sections.profile-widget`                                                         |
| `sets`          | `/cabinet/sets`           | `cabinet` | authenticated | cabinet  | `sections.sets-list-widget`                                                       |
| `sets-create`   | `/cabinet/sets/create`    | `sets`    | authenticated | cabinet  | `sections.create-set-widget`                                                      |
| `sets-id-edit`  | `/cabinet/sets/:id/edit`  | `sets`    | authenticated | cabinet  | `sections.set-edit-form-widget`                                                   |
| `sets-id-learn` | `/cabinet/sets/:id/learn` | `sets`    | authenticated | cabinet  | `sections.learn-widget`                                                           |
| `sets-id-match` | `/cabinet/sets/:id/match` | `sets`    | authenticated | cabinet  | `sections.match-widget`                                                           |
| `not-found`     | `/404`                    | `index`   | public        | default  | `sections.heading-widget`, `sections.callout-widget`                              |

Публичны лендинг `/`, `/privacy` и страница 404. `/login` доступен только гостю;
`/cabinet` и все вложенные страницы требуют авторизации. После успешного входа и
при открытии `/login` залогиненным пользователем выполняется переход на `/cabinet`.

### Обязательная синхронизация фронтенда и CMS для AI-агентов

В корневой `CLAUDE.md`, который подключается из `AGENTS.md`, добавляется обязательное
правило: задача с изменением CMS-управляемой страницы, виджета или текста не считается
завершённой, пока соответствующие изменения не внесены во фронтенд и Strapi.
Там же фиксируются формулы Display name/API ID/UID/Vue name из раздела 5.2, запрет
префикса `Cms`, стабильность опубликованного UID и обязательный запуск `check:widgets`.

| Изменение в задаче                               | Что AI-агент обязан сделать в этой же задаче                                                                                                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Создана новая страница фронтенда                 | Создать страницу Strapi для `uk` и `en`, задать `routeName`, `path`, `parent`, `access`, `layout`, SEO и `blocks`; добавить её в идемпотентный seed/migration и реестр маршрутов                                                            |
| Создан новый или изменён существующий Vue-виджет | По контракту раздела 5.2 создать или обновить компонент `sections.*-widget`, Dynamic Zone `blocks`, frontend-маппер, discriminated union, Zod-контракт, OpenAPI и сгенерированные TypeScript-типы; подключить точный UID к нужным страницам |
| Добавлен, переименован или удалён текстовый ключ | Синхронно обновить записи `translation` для `uk` и `en` и seed/migration; обе локали получают полноценный текст без заглушек                                                                                                                |
| Удалена страница или виджет                      | Сначала убрать его использование из страниц CMS, затем удалить запись/схему, регистрацию, контракт и неиспользуемые переводы                                                                                                                |

Изменения CMS фиксируются в репозитории схемами и идемпотентным seed/migration.
Ручное изменение только в локальной админке не считается выполнением задачи. Агент не
создаёт отдельную страницу без продуктовой необходимости: он создаёт новую запись
`page`, только если в задаче действительно появился новый маршрут, и обновляет уже
существующие страницы, если на них был добавлен или изменён виджет.

Перед завершением такой задачи агент запускает генерацию типов, проверяет обе локали и
выполняет `make precommit`, в который входит `check:widgets`. Нельзя вводить собственную
вариацию имени, редактировать только одну сторону контракта или оставлять синхронизацию
CMS как ручной TODO.

---

## 11. Этапы и приёмка

### Этап 1 — CMS (ничего не ломает, фронт продолжает работать)

- 2 компонента `shared`, 14 компонентов `sections`
- Типы `page`, `translation`, `redirect`, `global`
- Локали `uk`, `en`
- Контроллеры `bootstrap`, `resolve`, `redirects`
- Preview Strapi для `page` и защищённый режим `status=draft`
- Zod-контракты кастомных маршрутов и `cms/openapi.json`
- Генерация внутренних типов через `strapi ts:generate-types`
- Проверка `check:widgets` и её подключение к `make precommit`
- Права роли Public
- Сид-скрипт
- Правило синхронизации фронтенда и CMS для AI-агентов в корневом `CLAUDE.md`

**Приёмка:** `/api/bootstrap?locale=uk` и `/api/pages/resolve?path=/cabinet/sets/42/learn` отдают корректные данные, включая локализованные хлебные крошки; ответы проходят проверку соответствующими Zod-схемами; `resolve` возвращает черновик только с корректным серверным preview-секретом; `check:widgets` выявляет отсутствующий, лишний или неправильно названный UID на любой стороне контракта; в `CLAUDE.md` зафиксированы правила именования и обязательная синхронизация страниц, виджетов и переводов с CMS; `make precommit` зелёный.

### Этап 2 — каркас фронта

- `@nuxtjs/i18n`, стратегия префиксов
- Загрузка `bootstrap` с трёхуровневым кешем
- Инвалидация двух реплик через `_revalidate` и общий version-key Redis без Pub/Sub
- Генерация `api.generated.ts` из CMS OpenAPI через `openapi-typescript`
- `usePageRoutes`, замена `RouteName`
- Переписанный middleware доступа
- Серверные endpoints входа и выхода из Preview
- Две production-реплики `frontend`, общий network alias, healthcheck и балансировка reverse proxy

**Приёмка:** существующие страницы работают, тексты приходят из CMS, переключатель языков меняет локаль; Preview из Strapi показывает черновик, не кешируется и не оставляет токен в адресе страницы; запросы действительно обслуживаются обеими репликами; после одной публикации и одного вызова `_revalidate` обе реплики отдают новую версию контента, а значение `cms:content:version` увеличивается ровно один раз; изменение публичной `response`-схемы приводит к изменению сгенерированных frontend-типов, а неизвестный `__component` вызывает ошибку TypeScript в реестре.

### Этап 3 — рендер

- `[...slug].vue`, реестр рендеринга, `BaseBreadcrumbs`, 3 Vue-компонента контента и `HomeWidget`

**Приёмка:** 13 перенесённых страниц, новый публичный лендинг и страница 404 открываются через динамический маршрут; `/hovermap` возвращает 404; на каждой странице есть корректная локализованная цепочка хлебных крошек; перенесённые страницы визуально совпадают со старой версией.

### Этап 4 — снос и SEO

- Удаление 14 старых файлов страниц
- Удаление неиспользуемых `SetEditHeroWidget.vue` и `SetEditHero.vue`
- hreflang, sitemap, robots, middleware будущих CMS-редиректов

**Приёмка:** в `pages/` остался один файл; все маршруты работают; `make precommit` зелёный.

> Этап 4 выполняется только после явного подтверждения заказчика на этапе 3.

---

## 12. Риски

| Риск                                    | Последствие                                   | Что делаем                                                             |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| Strapi недоступен                       | Сайт без текстов и маршрутов                  | Трёхуровневый кеш, снимок в памяти                                     |
| Пустая CMS при первом деплое            | Сайт без единого маршрута                     | Идемпотентный сид-скрипт                                               |
| Новый ключ перевода забыли завести      | Пустое место в интерфейсе                     | `[NO_TRANSLATION: key]` в dev; сам ключ и однократный лог в prod       |
| Имя виджета расходится между CMS и Nuxt | Блок не рендерится или выпадает из API-типа   | Единый контракт имён + обязательный `check:widgets`                    |
| Задержка SSR из-за CMS                  | Медленный отклик                              | Кеш + `resolve` по ключу пути                                          |
| Webhook попал только в одну реплику     | Вторая могла бы показывать старый CMS-контент | Общий version-key в Redis проверяется обеими репликами                 |
| Redis недоступен при публикации         | Нельзя инвалидировать обе реплики             | `_revalidate` отвечает `503`, критический лог и повтор webhook вручную |
| Правка slug ломает ссылки               | Потеря позиций в поиске                       | Тип `redirect`                                                         |
| Цикл в связях `parent`                  | Невозможно построить хлебные крошки           | Валидация цикла + ограничение глубины в `resolve`                      |
| OpenAPI Strapi экспериментальный        | Формат меняется после обновления CMS          | Фиксируем версию Strapi; спецификацию и типы проверяем diff в CI       |
| Dynamic Zone превращается в `{}`        | Фронтенд теряет union виджетов                | Явная Zod `response`-схема `resolve` со всеми вариантами `__component` |

### Принятые заказчиком компромиссы

1. **Нет локальных файлов переводов.** Добавляя строку в код, сначала нужно завести ключ в админке. TypeScript такие ключи не проверяет.
2. **Объём работ.** Это переделка фронтенда, а не настройка CMS: 16 компонентов Strapi, 3 Vue-компонента контента, `HomeWidget`, i18n с нуля, слой кеширования, вынос строк интерфейса в CMS.

---

## 13. Переменные окружения

Добавляются в корневой `.env` и передаются через `compose.yaml` соответствующим
сервисам `frontend` и `cms`:

```env
# Общий секрет для вебхука ревалидации
NUXT_REVALIDATE_SECRET=

# Общий секрет CMS и Nuxt для защищённого Preview черновиков
CMS_PREVIEW_SECRET=

# Публичный origin Nuxt, на который Strapi формирует Preview-ссылку
CMS_PREVIEW_URL=

# Redis для кеша контента
NUXT_REDIS_URL=redis://p-quizpet-redis:6379
```

Уже существующие `NUXT_CMS_INTERNAL_URL`, `NUXT_PUBLIC_CMS_URL` и остальные переменные
блока `CMS_*` не меняются.
