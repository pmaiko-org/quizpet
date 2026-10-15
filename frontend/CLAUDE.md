# Frontend architecture

The frontend (`app/`) follows a **layered feature-based architecture** (в духе Feature-Sliced Design, но упрощённой под размер проекта).

## Vue-компоненты (стиль)

В компонентах всегда деструктурируй пропсы прямо из `defineProps` (без `withDefaults`):

```ts
const { title, isLoading = false } = defineProps<{
  title: string;
  isLoading?: boolean;
}>();
```

Не сохраняй результат `defineProps` в объект `props`, если для этого нет веской причины.

Эмиты объявляй через `defineEmits` с дженерик-синтаксисом кортежей, результат сохраняй в `const emit`. Имена событий — в `camelCase`. Payload описывай туплетом типов аргументов (пустой `[]` для событий без данных). Не используй объектный синтаксис `defineEmits({ ... })`:

```ts
const emit = defineEmits<{
  change: [id: number];
  update: [value: string];
  remove: [id: number, force: boolean];
  close: [];
}>();
```

Локальные обработчики событий называй через `handle + действие`: `handleSubmit`, `handleClose`, `handleDeleteCard`. Название должно описывать смысл действия, а не элемент интерфейса: `handleDeleteCard` лучше, чем `handleButtonClick`.

Входящие callback-пропсы называй через `on + действие`: `onClose`, `onSubmit`. Избегай неинформативных имён вроде `click`, `buttonClick`, `doStuff`.

Для простых обработчиков допустимы короткие имена вроде `handleKnown` и `handleMissed`, если контекст компонента однозначен.

Короткие примеры:

```ts
// good
const handleSubmit = () => {};
const handleDeleteCard = (cardId: string) => {};
const { onClose, onSubmit } = defineProps<{
  onClose?: () => void;
  onSubmit?: () => void;
}>();

// bad
const click = () => {};
const buttonClick = () => {};
const doStuff = () => {};
const { submitCallback } = defineProps<{
  submitCallback?: () => void;
}>();
```

## Стилизация и Tailwind CSS

По умолчанию вся стилизация выполняется utility-классами Tailwind CSS прямо в шаблоне.

Перед созданием собственного CSS-класса сначала проверь, можно ли решить задачу:

- стандартными utility-классами Tailwind;
- arbitrary values;
- CSS-переменными;
- существующими design tokens и компонентами проекта;
- через `@layer components` и `@apply`, но только если это реально улучшает читаемость и переиспользование.

Собственный CSS допустим только в обоснованных случаях:

- сложные селекторы;
- псевдоэлементы;
- стили сторонних библиотек;
- сложные анимации и transition-классы;
- состояния, которые неудобно или невозможно выразить через Tailwind;
- большие повторяющиеся наборы utility-классов, если это уже самостоятельный переиспользуемый визуальный блок.

Если custom CSS действительно нужен, придерживайся таких правил:

- используй BEM;
- имя корневого BEM-блока должно совпадать с именем Vue-компонента в `kebab-case`;
- не используй общие имена вроде `.container`, `.wrapper`, `.title`, `.button`, `.active`;
- классы должны быть привязаны к конкретному компоненту, например `.user-profile-card__title` или `.user-profile-card__button--active`.

`@apply` не используй для механического выноса Tailwind-классов в локальный CSS. Такой вынос допустим только для реально переиспользуемого паттерна или когда длинный набор utility-классов заметно ухудшает читаемость шаблона.

SCSS/Sass используй только как крайний вариант: когда обычного CSS недостаточно или вложенность заметно улучшает читаемость сложных BEM-стилей. Не используй Sass только ради простых вложенных селекторов или переменных, которые можно заменить CSS-переменными.

Код разложен по слоям. Каждый слой знает только про слои **ниже** себя.

## Слои и направление зависимостей

```
shell  →  pages  →  features  →  core  →  shared
```

Читается: слой слева **может** импортировать слой справа, **никогда наоборот**.

| Слой         | Путь               | Назначение                                                                                                  | Может импортировать           |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **shell**    | `shell/`           | Каркас приложения: хром `The*` (header/footer/sidebar), который монтирует лейаут. Композиция фич в оболочку | pages, features, core, shared |
| **pages**    | `pages/`           | Роутинг: `definePageMeta` + монтаж секций фич. Без фетча, логики и вёрстки                                  | features, core, shared        |
| **features** | `features/<name>/` | Самодостаточные бизнес-фичи (де-факто доменные модули). Фича **не импортирует** другую фичу                 | core, shared                  |
| **core**     | `core/<name>/`     | Кросс-сквозная инфраструктура. Не знает про фичи                                                            | shared                        |
| **shared**   | `shared/`          | Доменно-независимые примитивы                                                                               | —                             |

> **Виджеты — это не отдельный слой, а подпапка фичи** (`features/<name>/widgets/`). Отдельного корневого `app/widgets/` нет. Виджет — точка входа экрана, которую монтирует страница; живёт внутри своей фичи и подчиняется тем же правилам изоляции, что и остальная фича.

`shared` — это отдельная папка `app/shared/` с набором каталогов: `components/base/` (доменно-независимые презентационные компоненты с префиксом `Base*`: от атомов-обёрток до переиспользуемых секций), `composables/`, `utils/`, `validation.ts`, `store/` (глобальные Pinia-сторы; сейчас пуст), `repository/`, `types/`, `constants.ts`. Хром приложения (`The*`) в `shared` **не живёт** — он поднят в `shell/` (см. ниже), т.к. композирует фичи в оболочку и потому обязан иметь право импортировать слои над `shared`.

## Срезы (slices): что режется по домену, а что нет

**Срез (slice) — это разбиение слоя по бизнес-домену с правилом изоляции** (соседние срезы не знают друг о друге). Не каждый слой режется на срезы — только там, где есть «ось домена» И нужна изоляция соседей. Иначе слой плоский и структурирован только по **сегментам** (техническая роль: `components/`, `composables/`, `utils/`, …).

| Слой          | Срезы?         | Ось разбиения                                             | Изоляция соседей                          |
| ------------- | -------------- | --------------------------------------------------------- | ----------------------------------------- |
| **shell**     | ❌ нет         | — (плоско: `The*`)                                        | —                                         |
| **pages**     | ❌ нет         | по **маршруту** (файл = URL), не по домену                | —                                         |
| **features**  | ✅ да          | по **бизнес-домену**: `sets`, `profile`, `people`, `auth` | 🔒 строгая (A ↛ B, ESLint `crossFeature`) |
| **core**      | ✅ да (модули) | по **инфраструктурной задаче**: `session`, `ui`, …        | 🔓 слабая (правилом не enforced)          |
| **shared**    | ❌ нет         | по **сегменту** (техническая роль)                        | —                                         |
| **app-infra** | ❌ нет         | по Nuxt-конвенции (по одному на задачу)                   | —                                         |

**Правило:** срез появляется, когда одновременно (1) есть, что резать по домену, и (2) соседи не должны знать друг о друге.

- **`features` — эталон.** Много доменов, обязаны быть изолированы (фича не тянет чужую фичу) → срезы + жёсткое `crossFeature`. Общее между доменами спускается в `core`/`shared`.
- **`core` — срезы-«модули» по инфраструктуре, не по домену.** `session`/`ui`/`theme` — разные технические заботы; изоляция между ними **не навязана** (`core` — общий фундамент, ему логично шарить внутри себя).
- **`shared` — принципиально без срезов.** Доменно-независимые примитивы: резать нечего, изоляция не нужна (должен быть доступен всем сверху). Только сегменты. В каноничном FSD `shared` и `app` — ровно те слои, у которых срезов нет.
- **`shell` и `app-infra` — «синглтон-каркас».** Хедер/футер/сайдбар, layouts/plugins — по одному экземпляру на приложение; нет множества доменов → нечего резать.
- **`pages` — режется, но по оси маршрута** (структура файлов = схема URL, Nuxt-конвенция), а не по домену. Страницы тонкие, домены живут в `features`.

**Короткая формула:** срезы = там, где код делится по домену и домены надо изолировать (→ `features`). Где код либо универсальный примитив (`shared`), либо единственный каркас (`shell`, `app-infra`), либо режется по маршруту (`pages`) — срезов нет.

## Слой `core/`

Инфраструктура, от которой зависит всё приложение. Один подкаталог = один модуль (`core/<name>/{store,composables,components}/`).

| Модуль          | Статус    | Содержимое                                                                                                                                             |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `core/cms/`     | ✅ есть   | Маршрутизация и контент CMS: локали (`locales.ts`), `useCmsBootstrap`, `useCmsPage`, `usePageRoutes`, `useCmsPageSeo`, `useLocaleSwitch`, типы `TCms*` |
| `core/session/` | ✅ есть   | Токены, refresh, logout (`useAuthStore`); **идентичность текущего юзера** (`composables/useCurrentUser.ts`)                                            |
| `core/ui/`      | ✅ каркас | Стейт UI-инфраструктуры (`useUiStore`) — дом для тем и модалок                                                                                         |
| `core/api/`     | 🔜 план   | HTTP-клиент: сейчас `plugins/api.ts` (перенос отложен — плагин живёт в `plugins/` по конвенции Nuxt)                                                   |
| `core/toast/`   | 🔜 план   | Тосты (обёртка над `useToast` из Nuxt UI)                                                                                                              |
| `core/theme/`   | 🔜 план   | Переключение темы                                                                                                                                      |
| `core/modal/`   | 🔜 план   | Менеджер модалок                                                                                                                                       |

> `auth` раньше был фичей. Это инфраструктура сессии (от неё зависят все), поэтому она переехала в `core/session` — так её можно тянуть из любого слоя, не нарушая правило «фича не импортирует фичу».

> **CMS-маршрут — это инфраструктура, а не фича.** От разрешённой CMS-страницы зависят `middleware` (layout + access), `layouts`, `shell` (шапки) и сами фичи (`sets` берёт `:id` из параметров пути). Поэтому состояние CMS-страницы, bootstrap, резолвинг маршрутов и локали живут в `core/cms`, а `features/cms` остаётся только контентной фичей (презентационные виджеты Dynamic Zone + реестр). Раньше это решалось связкой `provide/inject` в `[...slug].vue` — она была нужна лишь чтобы `features/sets` не импортировал `features/cms`; после переезда в `core` инъекция не нужна, параметры читаются из `useCmsPage().params`.

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

> Хром приложения (`TheHeader`/`TheFooter`/`TheSidebar`) — это обвязка макета, а не виджет страницы; живёт в слое `shell/` (`shell/components/`) и монтируется в `layouts/`.

> **Каркас выбирается полем `layout` страницы в CMS, а не `routeName` в коде.** Каждому значению enum соответствует файл в `layouts/`: `default` (`TheHeader`), `landing` (`LandingHeader`), `cabinet` (сайдбар), `empty`. Если экрану нужен другой хром — заводится новое значение enum и новый файл лейаута (схема Strapi + Zod-контракт + сид + миграция + OpenAPI/типы), а не ветвление `page.routeName === "..."` внутри лейаута.

## Слой `shell/` — каркас приложения (префикс `The*`)

Составные части макета, которые монтируются в `layouts/` и рендерятся **в единственном экземпляре** на странице (хедер, футер, сайдбар, хлебные крошки), носят префикс **`The`** — конвенция Vue для single-instance-компонентов. Так тег сразу читается как «это часть каркаса, а не переиспользуемый кирпич»:

```
shell/components/          # The* — по одному на макет
├── TheHeader.vue
├── TheFooter.vue
├── TheSidebar.vue
└── TheSidebarProfileSkeleton.vue   # дочерний под-блок сайдбара тоже под The*
```

**Почему `shell` — отдельный верхний слой, а не `shared`.** Хром композирует фичи в оболочку приложения: сайдбар показывает статистику текущего юзера (`useMyStats` из `features/profile`), идентичность берёт из `core` (`useCurrentUser`). Значит он **обязан** иметь право импортировать `features`, `core`, `pages`. В `shared` это было бы восходящим импортом (запрещено ESLint) и держалось только на дыре авто-импорта. `shell` стоит **выше** `pages` в графе слоёв (`shell → pages → features → core → shared`), поэтому такие импорты легальны, а обратные (`pages`/`features` → `shell`) — запрещены: страница монтирует виджеты, хром монтирует лейаут, не наоборот.

Правило: **`The*` = используется единожды и является составной частью каркаса.** Это НЕ относится к переиспользуемым презентационным компонентам из `shared/components/base/` (`BaseHeroSection`, `BaseMetricGrid`, `BaseSectionHeader`, …) — те доменно-независимы, могут монтироваться многократно на любых страницах и живут под префиксом `Base*`.

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
- `features/sets/` — наборы, карточки и режимы обучения (домен «карточки»; корень агрегата — `Set`, дочерняя сущность — `Card`): `types.ts`, `validation.ts`, `utils.ts`, feature-композаблы, presentational-компоненты форм/списка/Learn/Match и page-level виджеты `widgets/{SetsList,CreateSet,SetEditForm,Learn,Match}Widget.vue`.
- `features/people/` — список пользователей платформы: `utils.ts` (`pluralUsers`), `composables/usePeopleList.ts`, `components/{PersonCard,PeopleGrid}.vue`, виджеты `widgets/{PeopleHeroWidget,PeopleGridWidget}.vue`
- `features/auth/` — UI экрана логина: `components/{LoginShowcase,LoginPanel}.vue`, виджет `widgets/LoginWidget.vue` (инфраструктура сессии/токенов живёт отдельно в `core/session`)

> Имя `sets` — по корню агрегата. Сущность `Card` (`CardForm`, `useCardSpeech`, `repository/cards.ts`, типы `ICard*`) существует и остаётся под своим именем — это часть того же домена, а не отдельная фича.

## Страницы (тонкие)

В `pages/` находится только `[...slug].vue`: он разрешает CMS-маршрут, применяет layout,
access и SEO, отображает breadcrumbs и динамически монтирует виджеты из реестра точных
`widgets.*` UID. Отдельные route-файлы для CMS-страниц запрещены.

- Фетч и производная логика функционального виджета находятся в композаблах его фичи.
- Presentational-блок → `features/<name>/components/`; page-level блок Dynamic Zone →
  `features/<name>/widgets/*Widget.vue` или `features/cms/widgets/*Widget.vue`.
- Все CMS-виджеты в реестре `features/cms/registry/widgetRegistry.ts` подключаются через
  `defineAsyncComponent` и динамический `import()`.
- Параметры совпавшего CMS-пути виджет получает через `useCmsPage().params`.
- Bootstrap CMS (маршруты, глобальные настройки, переводы всех локалей) загружается один раз
  в плагине `plugins/cms.ts`; страница его не фетчит.
- Локали не хардкодятся: единственный источник правды — `core/cms/locales.ts`
  (`CMS_LOCALES`, `DEFAULT_CMS_LOCALE`, `localizePath`, `localeFromPath`, `nextCmsLocale`),
  его же использует `nuxt.config.ts` и `server/`.

## Навигация

Правила навигации по приложению:

- Источник правды о внутренних маршрутах — записи `page` в Strapi и их стабильный
  `routeName`, а не файловая структура Nuxt.
- Внутренние ссылки строятся через `usePageRoutes().resolve(routeName, params, locale)`;
  URL страницы не хардкодится в компонентах.

  ```ts
  const routes = usePageRoutes();
  await navigateTo(routes.resolve("sets-id-edit", { id }));
  ```

- **Программный переход — только `navigateTo`, не `router.push`/`router.replace`.** `navigateTo` — SSR-безопасная обёртка Nuxt (умеет middleware, `external`, работает на сервере). Для замены записи в истории — второй аргумент:

  ```ts
  await navigateTo(routes.resolve("sets"));
  await navigateTo(routes.resolve("cabinet"), { replace: true });
  ```

  `useRouter()` для навигации не используем (оставлен только для чтения, если реально нужен).

- **Тип для пропа/поля, принимающего цель перехода**, — `RouteLocationRaw` из
  `vue-router`; строка, возвращённая `usePageRoutes`, ему соответствует.
- Параметры текущей CMS-страницы берутся через `useCmsRouteParams()`. `useRoute()`
  остаётся допустимым только для query и другой информации реального URL.

## Правила слоёв (enforced by ESLint)

Одно кастомное правило `local/layer-imports` (в `eslint.config.mjs`) стережёт **весь граф** сразу:

- **Направление зависимостей** по высоте слоёв `shared(0) < core(1) < features(2) < pages(3) < shell(4) < app-infra(5)`: импортировать можно только слой с высотой ≤ своей. Восходящий импорт (напр. `core → features`, `shared → core`, `pages → shell`) — ошибка.
- **Изоляция фич**: `features/A` не импортирует `features/B`.

Правило матчит **строку импорта `~/...`** (не резолвит путь) — намеренно, т.к. в проекте не настроен резолвер алиасов. Ограничение: то, что подключается **авто-импортом** (сторы/композаблы/компоненты без `import`), правило не видит — это лечится дисциплиной, а не линтером. `eslint-plugin-boundaries` не подошёл: без резолвера `~` он молча ничего не проверяет.

Второе кастомное правило `local/relative-within-feature` (тот же файл, **автофиксится**): **внутри одной фичи/`core`-модуля свои же файлы импортируются относительным путём**, а не через алиас той же фичи. Т.е. в `features/sets/components/SetForm.vue` пиши `import { setSchema } from "../validation"`, а **не** `"~/features/sets/validation"`. Алиас `~/…` остаётся только для выхода наружу модуля (в `shared`, `core`, `~/types` и т.п.); межфичевые `~/features/B` по-прежнему ловит `layer-imports`. Правило сравнивает `(layer, module)` файла и импорта: совпали — требует относительный путь.

## Порядок импортов

Плагин `eslint-plugin-simple-import-sort` (`simple-import-sort/imports` + `/exports`, **автофикс**) сортирует импорты по группам с пустой строкой между ними: side-effects → `node:`/внешние пакеты → алиасы `~/…` и bare-специфаеры (`#ui/…`) → относительные (`../`, `./`). Внутри группы — по алфавиту. Не редактируй порядок руками — `npm run lint:fix` расставит.

Правило принятия решения:

- «Нужно только одной фиче?» → внутрь этой фичи (fetch/логика экрана → её section-композабл `composables/use*.ts`; экран → `widgets/*Widget.vue`; presentational-кирпич → `components/`).
- «Могут понадобиться нескольким фичам (доменно-нейтральное)?» → в `shared` (`app/shared/`).
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

Единый компонент `shared/components/base/BaseDataBoundary.vue` (`<BaseDataBoundary>`) владеет ветвлением `pending / error / empty / контент` и дефолтной error-карточкой (`@retry`). Виджеты/гриды не дублируют этот UI:

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
// порядок записей — по приоритету слоёв: shell → features → core → shared
components: [
  { path: "~/shell/components", pathPrefix: false },
  // features: components + widgets — ОДНОЙ записью: Nuxt дедупит `components`-директории
  // по `path`, две записи с одинаковым `~/features` → вторая молча игнорится.
  { path: "~/features", pattern: "*/{components,widgets}/**/*.vue", pathPrefix: false },
  { path: "~/core", pattern: "*/components/**/*.vue", pathPrefix: false },
  { path: "~/shared/components", pathPrefix: false },
],
imports: {
  dirs: [
    "~/shell/composables",
    "~/features/*/store/**/*",
    "~/features/*/composables/**/*",
    "~/core/*/store/**/*",
    "~/core/*/composables/**/*",
    "~/shared/store",
    // shared/composables и shared/utils больше не в конвенционном ~/composables|~/utils,
    // поэтому их нужно явно добавить в dirs, иначе авто-импорт не подхватит.
    "~/shared/composables",
    "~/shared/utils",
  ],
},
```

> После переноса `composables/` и `utils/` из корня `app/` в `app/shared/` они выпадают из конвенционного авто-импорта Nuxt (`~/composables`, `~/utils`) — поэтому явно перечислены в `imports.dirs`. Компоненты `shared` и `shell` регистрируются двумя `components`-записями; папки `app/components` больше нет.
