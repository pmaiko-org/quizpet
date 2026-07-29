# Frontend architecture

The frontend (`app/`) follows a **layered feature-based architecture** (в духе Feature-Sliced Design, но упрощённой под размер проекта).

Код разложен по слоям. Каждый слой знает только про слои **ниже** себя.

## Слои и направление зависимостей

```
pages  →  features  →  core  →  shared
```

Читается: слой слева **может** импортировать слой справа, **никогда наоборот**.

| Слой         | Путь                     | Назначение                                                                                  | Может импортировать    |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------- | ---------------------- |
| **pages**    | `pages/`                 | Роутинг: `definePageMeta` + монтаж секций фич. Без фетча, логики и вёрстки                  | features, core, shared |
| **features** | `features/<name>/`       | Самодостаточные бизнес-фичи (де-факто доменные модули). Фича **не импортирует** другую фичу | core, shared           |
| **core**     | `core/<name>/`           | Кросс-сквозная инфраструктура. Не знает про фичи                                            | shared                 |
| **shared**   | корень `app/` (см. ниже) | Доменно-независимые примитивы                                                               | —                      |

> **Виджеты — это не отдельный слой, а подпапка фичи** (`features/<name>/widgets/`). Отдельного корневого `app/widgets/` нет. Виджет — точка входа экрана, которую монтирует страница; живёт внутри своей фичи и подчиняется тем же правилам изоляции, что и остальная фича.

`shared` — это не отдельная папка, а набор корневых каталогов `app/`: `components/` (`base/` — дизайн-примитивы, `layout/` — хром приложения `App*`), `composables/`, `utils/`, `validation.ts`, `store/` (глобальные Pinia-сторы; сейчас пуст), `repository/`, `types/`.

## Слой `core/`

Инфраструктура, от которой зависит всё приложение. Один подкаталог = один модуль (`core/<name>/{store,composables,components}/`).

| Модуль          | Статус    | Содержимое                                                                                                  |
| --------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| `core/session/` | ✅ есть   | Токены, refresh, logout (`useAuthStore`); **идентичность текущего юзера** (`composables/useCurrentUser.ts`) |
| `core/ui/`      | ✅ каркас | Стейт UI-инфраструктуры (`useUiStore`) — дом для тем и модалок                                              |
| `core/api/`     | 🔜 план   | HTTP-клиент: сейчас `plugins/api.ts` (перенос отложен — плагин живёт в `plugins/` по конвенции Nuxt)        |
| `core/toast/`   | 🔜 план   | Тосты (обёртка над `useToast` из Nuxt UI)                                                                   |
| `core/theme/`   | 🔜 план   | Переключение темы                                                                                           |
| `core/modal/`   | 🔜 план   | Менеджер модалок                                                                                            |

> `auth` раньше был фичей. Это инфраструктура сессии (от неё зависят все), поэтому она переехала в `core/session` — так её можно тянуть из любого слоя, не нарушая правило «фича не импортирует фичу».

> **«Кто я» — это сессия, а не фича `profile`.** Текущий юзер (`/users/me`) нужен пол-приложения (sidebar, права на удаление наборов, форма профиля), поэтому живёт в `core/session/composables/useCurrentUser.ts` (общий ключ `useAsyncData("current-user")` → один запрос на всех). Фича `profile` — это только **экран редактирования** профиля (форма + мутация), а не источник идентичности. Именно так снялся бывший кросс-фичевый клей (`sets` брал email из `profile`): теперь `sets` читает `useCurrentUser()` из `core`.

## Виджеты фичи (`features/<name>/widgets/`)

**Виджет — это компонент-точка входа экрана.** Всё, что монтирует страница, — это виджет с суффиксом `*Widget` из папки `features/<name>/widgets/` (рядом с `components/`). Правило именования: **компонент, который кладут прямо на страницу, оканчивается на `Widget`**; presentational-кирпичи, из которых он собирает экран, лежат в `components/` без этого суффикса.

Виджет:

1. зовёт section-композабл своей фичи (`useSetsList`, `useLearnSession`, …) — там fetch, стейт, `computed`;
2. рендерит из этого presentational-компоненты (`components/SetsGrid`, `components/SetsHero`);
3. кросс-сквозные значения (текущий юзер) берёт из `core` (`useCurrentUser`) и отдаёт композаблу аргументом-`Ref` — **не** импортом чужой фичи.

Разделение внутри фичи:

| Папка         | Что лежит                                           | Пример                             |
| ------------- | --------------------------------------------------- | ---------------------------------- |
| `widgets/`    | `*Widget.vue` — то, что монтирует **страница**      | `SetsGridWidget`, `LearnWidget`    |
| `components/` | presentational-кирпичи, из которых виджет строит UI | `SetsGrid`, `SetsHero`, `CardForm` |

Даже статичный/самодостаточный блок, попадающий на страницу, — это виджет (напр. `ProfileWidget`, `PeopleHeroWidget`). Несколько виджетов одного экрана могут делить один section-композабл — Nuxt кэширует `useAsyncData` по ключу, поэтому запрос будет один (`SetsHeroWidget` + `SetsGridWidget` делят ключ `"sets"`).

Виджеты авто-регистрируются паттерном `~/features/*/widgets/**/*.vue` (`pathPrefix: false`), имя глобально уникально. Виджет лежит **внутри** своей фичи → для ESLint это слой `features`, значит правило изоляции действует и на него (виджет фичи A не импортирует фичу B).

> Хром приложения (`AppHeader`/`AppFooter`/`AppSidebar`) — это обвязка макета, а не виджет страницы; живёт в `components/layout/` (shared) и монтируется в `layouts/`.

## Слой `features/`

| Путь                            | Purpose                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `features/<name>/widgets/`      | `*Widget.vue` — точки входа экрана (то, что монтирует страница)           |
| `features/<name>/components/`   | Presentational-кирпичи, из которых виджет строит UI (`pathPrefix: false`) |
| `features/<name>/store/`        | Feature-scoped Pinia-стор (`defineStore`, setup-синтаксис)                |
| `features/<name>/composables/`  | Feature-scoped композаблы (в т.ч. section-композабл `use*.ts`)            |
| `features/<name>/types.ts`      | Feature-scoped типы и фабрики                                             |
| `features/<name>/validation.ts` | Feature-scoped Zod-схемы                                                  |
| `features/<name>/utils.ts`      | Feature-scoped чистые утилиты                                             |

**Виджет (`widgets/*Widget.vue`) — точка входа экрана** (см. «Виджеты фичи»). Его монтирует прямо страница; он зовёт section-композабл и рендерит presentational-компоненты из `components/`.

**Section-композабл (`composables/use*.ts`) — сердце фичи.** Именно он владеет всей однофичевой логикой экрана: fetch (`useAsyncData` + `refresh`), локальный стейт (пагинация, стейт-машина), производные `computed`, экшены. Возвращает готовую view-model, которую монтирует виджет. Кросс-сквозные значения (напр. текущий юзер) виджет берёт из `core` и отдаёт композаблу **аргументом-`Ref`** (см. `useSetsList(email)` из `useCurrentUser`), а не импортом чужой фичи. Самодостаточный feature-компонент (напр. `SetForm`) тоже вправе фетчить свои данные — через собственный композабл (`useSetForm`), а не напрямую из `$repository` в `.vue`.

Текущие фичи:

- `features/profile/` — **экран редактирования** профиля: `widgets/ProfileWidget.vue` (форма + мутация через `$repository.profile`), статистика текущего юзера (`composables/useMyStats.ts` — потребляется сайдбаром). Идентичность юзера («кто я») тут **не живёт** — это `core/session/useCurrentUser`.
- `features/sets/` — наборы, карточки, режим обучения (домен «карточки»; корень агрегата — `Set`, дочерняя сущность — `Card`): `types.ts`, `validation.ts`, `utils.ts`, `composables/{useCardSpeech,useSetsList,useLearnSession,useSetEdit,useSetForm}.ts`, presentational `components/{SetForm,CardForm,SetCsvTransfer,SetCard,SetsGrid,SetsHero,SetEditHero}.vue` + `components/learn/Learn*.vue`, виджеты `widgets/{SetsHeroWidget,SetsGridWidget,CreateSetWidget,SetEditFormWidget,SetEditHeroWidget,LearnWidget}.vue`
- `features/people/` — список пользователей платформы: `utils.ts` (`pluralUsers`), `composables/usePeopleList.ts`, `components/{PersonCard,PeopleGrid}.vue`, виджеты `widgets/{PeopleHeroWidget,PeopleGridWidget}.vue`
- `features/auth/` — UI экрана логина: `components/{LoginShowcase,LoginPanel}.vue`, виджет `widgets/LoginWidget.vue` (инфраструктура сессии/токенов живёт отдельно в `core/session`)

> Имя `sets` — по корню агрегата. Сущность `Card` (`CardForm`, `useCardSpeech`, `repository/cards.ts`, типы `ICard*`) существует и остаётся под своим именем — это часть того же домена, а не отдельная фича.

## Страницы (тонкие)

**Страница = `definePageMeta` + монтаж виджета(ов) фич. Больше ничего.** Ни `useAsyncData`, ни логики, ни собственной вёрстки — всё это внутри виджета. Если экран из нескольких виджетов — страница монтирует их все (допустим тонкий контейнер-обёртка для раскладки/отступов).

```vue
<!-- pages/sets/index.vue целиком -->
<template>
  <div class="space-y-8">
    <SetsHeroWidget />
    <SetsGridWidget />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "cabinet" });
</script>
```

- Фетч и производная логика — в section-композаблах фич (`features/<name>/composables/`), а не в странице.
- **Внутри `pages/` НЕЛЬЗЯ держать компоненты** (`pages/<route>/components/` запрещено — каждый `.vue` в `pages/` это маршрут; конфиг Nuxt их и не сканирует). Presentational-блок → `features/<name>/components/`; целый экран → `features/<name>/widgets/*Widget.vue`.
- Несколько виджетов одного экрана могут делить один section-композабл — Nuxt кэширует `useAsyncData` по ключу, поэтому запрос будет один (напр. `SetsHeroWidget` + `SetsGridWidget` делят ключ `"sets"`).

Данные из маршрута виджет читает сам (`useRoute()`), поэтому странице нечего ему прокидывать.

## Правила слоёв (enforced by ESLint)

Одно кастомное правило `local/layer-imports` (в `eslint.config.mjs`) стережёт **весь граф** сразу:

- **Направление зависимостей** по высоте слоёв `shared(0) < core(1) < features(2) < pages(3) < app-infra(4)`: импортировать можно только слой с высотой ≤ своей. Восходящий импорт (напр. `core → features`, `shared → core`) — ошибка.
- **Изоляция фич**: `features/A` не импортирует `features/B`.

Правило матчит **строку импорта `~/...`** (не резолвит путь) — намеренно, т.к. в проекте не настроен резолвер алиасов. Ограничение: то, что подключается **авто-импортом** (сторы/композаблы/компоненты без `import`), правило не видит — это лечится дисциплиной, а не линтером. `eslint-plugin-boundaries` не подошёл: без резолвера `~` он молча ничего не проверяет.

Второе кастомное правило `local/relative-within-feature` (тот же файл, **автофиксится**): **внутри одной фичи/`core`-модуля свои же файлы импортируются относительным путём**, а не через алиас той же фичи. Т.е. в `features/sets/components/SetForm.vue` пиши `import { setSchema } from "../validation"`, а **не** `"~/features/sets/validation"`. Алиас `~/…` остаётся только для выхода наружу модуля (в `shared`, `core`, `~/types` и т.п.); межфичевые `~/features/B` по-прежнему ловит `layer-imports`. Правило сравнивает `(layer, module)` файла и импорта: совпали — требует относительный путь.

## Порядок импортов

Плагин `eslint-plugin-simple-import-sort` (`simple-import-sort/imports` + `/exports`, **автофикс**) сортирует импорты по группам с пустой строкой между ними: side-effects → `node:`/внешние пакеты → алиасы `~/…` и bare-специфаеры (`#ui/…`) → относительные (`../`, `./`). Внутри группы — по алфавиту. Не редактируй порядок руками — `npm run lint:fix` расставит.

Правило принятия решения:

- «Нужно только одной фиче?» → внутрь этой фичи (fetch/логика экрана → её section-композабл `composables/use*.ts`; экран → `widgets/*Widget.vue`; presentational-кирпич → `components/`).
- «Могут понадобиться нескольким фичам (доменно-нейтральное)?» → в `shared` (корень `app/`).
- «Инфраструктура/идентичность, нужная всем (сессия, текущий юзер, api, тосты, темы, модалки)?» → в `core/`.

## Сторы (Pinia)

Все сторы — **Pinia setup stores** (`defineStore("name", () => { ... })`), а не `useState`-композаблы. `defineStore` и `storeToRefs` авто-импортятся через `@pinia/nuxt` — явные `import` не нужны.

Правила:

- Внутри стора состояние — обычные `ref`/`computed` (не `useState`); для персистентности допустимы `useCookie`/`useLocalStorage`.
- **Возвращай из setup-стора все `state`-свойства** (требование Pinia: иначе ломается SSR/devtools/плагины). Возвращённые `ref` попадают в `pinia.state.value` и сериализуются в SSR-payload через `devalue`; возвращённые `computed` — это геттеры и не сериализуются.
- Для возвращённых, но «не настоящих» состояний оборачивай `ref` в **`skipHydrate()`** (`import { skipHydrate } from "pinia"` — авто-импорта нет). Это обязательно для:
  - несериализуемых/транзитных значений (`Promise`, `AbortController`) — см. `core/session`;
  - refs с собственной гидрацией (`useCookie`/`useLocalStorage`) — иначе гидрация Pinia перезатрёт их серверным значением.
- В потребителях: реактивное состояние и геттеры доставай через `storeToRefs(useXStore())`, экшены — деструктуризацией прямо из инстанса стора.

```ts
const store = useAuthStore();
const { isLoggedIn } = storeToRefs(store); // state/getters — реактивно
const { doLogout } = store; //               actions — напрямую
```

> Утилита `utils/toComputedStateRefs.ts` больше не используется (оставлена в кодовой базе намеренно).

## Отмена запросов

`signal` передаётся **только когда запрос действительно нужно уметь отменять** — обычный вызов остаётся `$repository.sets.getSets(query)` без опций.

Любой метод репозитория принимает необязательный `TRequestOptions` (`repository/types.ts`) с `signal`. Для отмены используй composable `useAbortSignal` (`composables/useAbortSignal.ts`) — авто-отмена предыдущего вызова и авто-отмена при размонтировании:

```ts
const { next } = useAbortSignal();

// поиск-по-вводу: новый вызов обрывает предыдущий
const search = query => $repository.sets.getSets(query, { signal: next() });
```

Голый `AbortController` тоже допустим, если нужен полный контроль:

```ts
const controller = new AbortController();
$repository.sets.getSets(query, { signal: controller.signal });
controller.abort();
```

Плагин `plugins/api.ts` ведёт набор живых запросов и умеет оборвать их разом (`abortAll` при принудительном логауте на 401). Контроллер вызывающего связывается с внутренним, поэтому работают оба механизма; контроллеры удаляются по завершении запроса (утечки нет).

## Состояния данных (`BaseDataBoundary`)

Единый компонент `components/base/BaseDataBoundary.vue` (`<BaseDataBoundary>`) владеет ветвлением `pending / error / empty / контент` и дефолтной error-карточкой (`@retry`). Виджеты/гриды не дублируют этот UI:

```vue
<BaseDataBoundary
  :pending="pending"
  :error="error"
  :empty="!items.length"
  errorTitle="Не вдалося завантажити"
  @retry="refresh"
>
  <template #loading> <!-- свой скелетон --> </template>
  <template #empty> <!-- своё пусто --> </template>
  <!-- дефолтный слот: контент -->
</BaseDataBoundary>
```

`loading`/`empty` переопределяются слотами (у каждого свои), `error` — общий по умолчанию. Используется в `SetsGrid`, `PeopleGrid`, `LearnWidget`.

## Nuxt auto-import wiring

Настроено в `nuxt.config.ts`. Компоненты и виджеты фич + компоненты core регистрируются с `pathPrefix: false`; сторы и композаблы этих слоёв авто-импортятся глобально (явные `import` в `.vue` не нужны):

```ts
components: [
  { path: "~/components", pathPrefix: false },
  // components + widgets — ОДНОЙ записью: Nuxt дедупит `components`-директории
  // по `path`, две записи с одинаковым `~/features` → вторая молча игнорится.
  { path: "~/features", pattern: "*/{components,widgets}/**/*.vue", pathPrefix: false },
  { path: "~/core", pattern: "*/components/**/*.vue", pathPrefix: false },
],
imports: {
  dirs: [
    "~/store",
    "~/core/*/store/**/*",
    "~/core/*/composables/**/*",
    "~/features/*/store/**/*",
    "~/features/*/composables/**/*",
  ],
},
```
