export type TLocale = "uk" | "en";

type TLocalizedTranslation = Record<TLocale, string>;
type TTranslationGroup = Record<string, TLocalizedTranslation>;
type TFunctionalWidgetUid =
  | "widgets.home-widget"
  | "widgets.login-widget"
  | "widgets.people-hero-widget"
  | "widgets.people-grid-widget"
  | "widgets.pitanyachka-widget"
  | "widgets.profile-widget"
  | "widgets.sets-list-widget"
  | "widgets.create-set-widget"
  | "widgets.set-edit-form-widget"
  | "widgets.learn-widget"
  | "widgets.match-widget";
type TWidgetTranslationValues = Partial<
  Record<TFunctionalWidgetUid, Record<TLocale, Record<string, string>>>
>;
type TWidgetTranslationSource = readonly [source: string, target: string];

export const globalTranslationGroups = {
  common: {
    menu: {
      uk: "Меню",
      en: "Menu",
    },
    breadcrumbs: {
      uk: "Навігаційний шлях",
      en: "Breadcrumbs",
    },
    landing: {
      uk: "Лендинг",
      en: "Landing",
    },
    people: {
      uk: "Люди",
      en: "People",
    },
    sets: {
      uk: "Набори",
      en: "Sets",
    },
    topics: {
      uk: "Теми",
      en: "Topics",
    },
    profile: {
      uk: "Профіль",
      en: "Profile",
    },
    logout: {
      uk: "Вийти",
      en: "Sign out",
    },
    newSet: {
      uk: "Новий набір",
      en: "New set",
    },
    createStudyCards: {
      uk: "Створити картки для навчання",
      en: "Create cards to study",
    },
    editProfile: {
      uk: "Редагувати профіль",
      en: "Edit profile",
    },
    openSidebar: {
      uk: "Відкрити або закрити бокову панель",
      en: "Open or close the sidebar",
    },
    studySpace: {
      uk: "Навчальний простір",
      en: "Learning space",
    },
    studyMode: {
      uk: "Режим навчання",
      en: "Study mode",
    },
    flashcardLearning: {
      uk: "Навчання картками",
      en: "Flashcard learning",
    },
    projectLinks: {
      uk: "Посилання проєкту",
      en: "Project links",
    },
    cancel: {
      uk: "Скасувати",
      en: "Cancel",
    },
    retry: {
      uk: "Повторити",
      en: "Retry",
    },
    save: {
      uk: "Зберегти",
      en: "Save",
    },
    error: {
      uk: "Помилка",
      en: "Error",
    },
    dataLoadError: {
      uk: "Не вдалося завантажити дані",
      en: "Could not load data",
    },
    retryAgain: {
      uk: "Спробувати знову",
      en: "Try again",
    },
    "color.choose": {
      uk: "Оберіть колір",
      en: "Choose a color",
    },
    "color.select": {
      uk: "Обрати колір {color}",
      en: "Choose color {color}",
    },
    apply: {
      uk: "Застосувати",
      en: "Apply",
    },
    clear: {
      uk: "Очистити",
      en: "Clear",
    },
    change: {
      uk: "Змінити",
      en: "Change",
    },
    refresh: {
      uk: "Оновити",
      en: "Refresh",
    },
    select: {
      uk: "Обрати",
      en: "Select",
    },
    profileLoading: {
      uk: "Завантаження профілю",
      en: "Loading profile",
    },
  },
  landing: {
    start: {
      uk: "Почати безкоштовно",
      en: "Start for free",
    },
    openCabinet: {
      uk: "Відкрити кабінет",
      en: "Open dashboard",
    },
    ctaShort: {
      uk: "Почати",
      en: "Start",
    },
  },
  filePicker: {
    open: {
      uk: "Натисніть, щоб вибрати або завантажити зображення",
      en: "Select or upload an image",
    },
    notSelected: {
      uk: "Зображення не вибране",
      en: "No image selected",
    },
    title: {
      uk: "Вибір зображення",
      en: "Choose an image",
    },
    description: {
      uk: "Тут можна завантажити новий файл або вибрати вже існуюче зображення.",
      en: "Upload a new file or choose an existing image.",
    },
    "upload.title": {
      uk: "Завантаження",
      en: "Upload",
    },
    "upload.description": {
      uk: "Після вибору файл одразу відправляється на сервер.",
      en: "The selected file is uploaded immediately.",
    },
    "upload.progress": {
      uk: "Завантаження...",
      en: "Uploading...",
    },
    "upload.label": {
      uk: "Натисніть або перетягніть зображення",
      en: "Select or drag an image",
    },
    "library.title": {
      uk: "Бібліотека",
      en: "Library",
    },
    "library.description": {
      uk: "Клік по картці вибирає файл. Видалення прибирає його з бібліотеки.",
      en: "Select a card to use the file. Deleting removes it from the library.",
    },
    "library.emptyTitle": {
      uk: "Бібліотека порожня",
      en: "The library is empty",
    },
    "library.emptyDescription": {
      uk: "Завантажте перше зображення, і воно одразу з’явиться тут.",
      en: "Upload the first image and it will appear here.",
    },
    selected: {
      uk: "Вибрано",
      en: "Selected",
    },
    "preview.empty": {
      uk: "Попередній перегляд з’явиться тут",
      en: "The preview will appear here",
    },
    "preview.active": {
      uk: "Активний файл",
      en: "Active file",
    },
    "preview.noFile": {
      uk: "Файл ще не вибраний",
      en: "No file selected yet",
    },
    "preview.pathHint": {
      uk: "Після вибору тут з’явиться шлях до файлу.",
      en: "The file path will appear here after selection.",
    },
    "preview.usage": {
      uk: "Це зображення буде використане для поточного поля форми.",
      en: "This image will be used for the current form field.",
    },
    "error.list": {
      uk: "Не вдалося завантажити список зображень.",
      en: "Could not load the image list.",
    },
    "error.upload": {
      uk: "Не вдалося завантажити файл на сервер.",
      en: "Could not upload the file.",
    },
    deleteConfirm: {
      uk: "Видалити файл «{name}» з бібліотеки?",
      en: "Delete “{name}” from the library?",
    },
    "error.delete": {
      uk: "Не вдалося видалити файл.",
      en: "Could not delete the file.",
    },
  },
} satisfies Record<string, TTranslationGroup>;

export const globalTranslationEntries = Object.entries(
  globalTranslationGroups,
).flatMap(([namespace, translations]) =>
  Object.entries(translations).map(([key, values]) => ({
    key: `${namespace}.${key}`,
    namespace,
    values,
  })),
);

export const widgetTranslationValues: TWidgetTranslationValues = {
  "widgets.home-widget": {
    uk: {
      eyebrow: "Сьогодні у QuizPet",
      "title.named": "{name}, готові до короткого навчального спринту?",
      "title.default": "Готові до короткого навчального спринту?",
      summary:
        "Оберіть набір і проведіть кілька хвилин у фокусі. Прогрес складається з коротких, регулярних повторень.",
      startLearning: "Почати навчання",
      quickAccess: "Швидкий доступ",
      keepPace: "Продовжуйте у своєму темпі",
      everythingNearby: "Усе необхідне для навчання зібране поруч.",
      "metric.people": "Люди",
      "metric.sets": "Набори",
      "metric.topics": "Теми",
      "link.cards.title": "Картки",
      "link.cards.description":
        "Ваші набори, повторення та швидкий старт навчання.",
      "link.profile.title": "Профіль",
      "link.profile.description":
        "Ім’я, аватар та особисті дані облікового запису.",
      "link.people.title": "Спільнота",
      "link.people.description":
        "Учасники платформи та майбутні навчальні зв’язки.",
    },
    en: {
      eyebrow: "Today in QuizPet",
      "title.named": "{name}, ready for a short learning sprint?",
      "title.default": "Ready for a short learning sprint?",
      summary:
        "Choose a set and spend a few focused minutes. Progress comes from short, regular reviews.",
      startLearning: "Start learning",
      quickAccess: "Quick access",
      keepPace: "Keep your own pace",
      everythingNearby: "Everything you need to learn is close at hand.",
      "metric.people": "People",
      "metric.sets": "Sets",
      "metric.topics": "Topics",
      "link.cards.title": "Cards",
      "link.cards.description":
        "Your sets, reviews, and a quick start to learning.",
      "link.profile.title": "Profile",
      "link.profile.description": "Your name, avatar, and account details.",
      "link.people.title": "Community",
      "link.people.description":
        "Platform members and future learning connections.",
    },
  },
  "widgets.login-widget": {
    uk: {
      eyebrow: "Вхід",
      title: "Продовжити в QuizPet",
      description:
        "Авторизуйся через Google, щоб зберегти прогрес, результати та персональні добірки квізів на будь-якому пристрої.",
      google: "Продовжити з Google",
      secure: "Без паролів. Безпечний вхід через Google.",
      "agreement.prefix":
        "Реєструючись або продовжуючи через Google, ви підтверджуєте, що ознайомилися з",
      "agreement.link": "Політикою конфіденційності та Умовами використання",
      openSource:
        "Проєкт з відкритим кодом. Повідомити про проблему або зв'язатися з автором:",
      githubAria: "GitHub проєкту QuizPet (відкривається в новій вкладці)",
      telegramAria: "Telegram автора (відкривається в новій вкладці)",
      "metric.quizzes": "готових квізів",
      "metric.live": "рейтинги та дуелі",
      "metric.sync": "прогрес між пристроями",
      "showcase.title": "Вікторини, які хочеться проходити до кінця",
      "showcase.description":
        "Обирай улюблені теми, відповідай швидше за інших і повертайся по нову порцію запитань.",
    },
    en: {
      eyebrow: "Sign in",
      title: "Continue to QuizPet",
      description:
        "Sign in with Google to keep your progress, results, and personal quiz collections on every device.",
      google: "Continue with Google",
      secure: "No passwords. Secure sign-in with Google.",
      "agreement.prefix":
        "By registering or continuing with Google, you confirm that you have read the",
      "agreement.link": "Privacy Policy and Terms of Use",
      openSource: "Open-source project. Report an issue or contact the author:",
      githubAria: "QuizPet project on GitHub (opens in a new tab)",
      telegramAria: "Author's Telegram (opens in a new tab)",
      "metric.quizzes": "ready-made quizzes",
      "metric.live": "ratings and duels",
      "metric.sync": "progress across devices",
      "showcase.title": "Quizzes you will want to finish",
      "showcase.description":
        "Choose favorite topics, answer faster than others, and come back for another round of questions.",
    },
  },
  "widgets.people-hero-widget": {
    uk: {
      eyebrow: "Спільнота",
      title: "Навчатися легше разом",
      description:
        "Знайомтеся з учасниками QuizPet і стежте, як зростає навчальна спільнота.",
    },
    en: {
      eyebrow: "Community",
      title: "Learning is easier together",
      description:
        "Meet QuizPet members and watch the learning community grow.",
    },
  },
  "widgets.people-grid-widget": {
    uk: {
      eyebrow: "Користувачі",
      title: "Усі учасники",
      count: "{count} користувач | {count} користувачі | {count} користувачів",
      error: "Не вдалося завантажити користувачів",
      empty: "Користувачів поки немає",
    },
    en: {
      eyebrow: "Users",
      title: "All members",
      count: "{count} user | {count} users",
      error: "Could not load users",
      empty: "There are no users yet",
    },
  },
  "widgets.pitanyachka-widget": {
    uk: {
      "hero.eyebrow": "Гра для компанії",
      "hero.title": "ПИТАНЯЧКА",
      "hero.description":
        "Усі, хто зайшов на цю сторінку, автоматично в грі. Будь-хто генерує питання, читає його вголос і передає хід далі.",
      "reading.title": "{name} читає своє питання",
      "reading.description":
        "Слухайте уважно та чекайте, поки хід передадуть далі.",
      "finished.title": "Питання закінчились",
      "finished.description":
        "Усі питання вже прозвучали. Натисніть «Почати заново», щоб зіграти зі свіжою колодою.",
      "free.title": "Хід вільний",
      "free.description":
        "Будь-хто з гравців може згенерувати наступне питання.",
      generate: "Згенерувати питання",
      player: "Гравець",
      "category.title": "Оберіть категорію",
      "category.description":
        "Питання під час гри будуть лише з обраної категорії. «Всі категорії» — грати з усіма питаннями одразу.",
      "category.all": "Всі категорії",
      start: "Почати гру",
      connected: "На звʼязку",
      connecting: "Підключення…",
      restart: "Почати заново",
      pass: "Передати хід",
    },
    en: {
      "hero.eyebrow": "Party game",
      "hero.title": "PITANYACHKA",
      "hero.description":
        "Everyone who opens this page joins the game automatically. Any player can generate a question, read it aloud, and pass the turn on.",
      "reading.title": "{name} is reading their question",
      "reading.description":
        "Listen carefully and wait for the turn to be passed on.",
      "finished.title": "No questions left",
      "finished.description":
        "Every question has been used. Select Restart to play with a fresh deck.",
      "free.title": "The turn is open",
      "free.description": "Any player can generate the next question.",
      generate: "Generate question",
      player: "Player",
      "category.title": "Choose a category",
      "category.description":
        "Questions will come only from the selected category. Choose All categories to play with the full deck.",
      "category.all": "All categories",
      start: "Start game",
      connected: "Connected",
      connecting: "Connecting…",
      restart: "Restart",
      pass: "Pass the turn",
    },
  },
  "widgets.profile-widget": {
    uk: {
      "loadError.title": "Не вдалося завантажити профіль",
      "loadError.description": "Спробуйте оновити дані профілю ще раз.",
      eyebrow: "Профіль",
      title: "Ваш профіль",
      description: "Оновіть ім’я та аватар, які бачать інші учасники QuizPet.",
      "firstName.label": "Ім'я",
      "firstName.description":
        "Використовується в профілі та списках користувачів.",
      "firstName.placeholder": "Наприклад, Петро",
      "lastName.label": "Прізвище",
      "lastName.description": "Допомагає показувати повне ім’я в інтерфейсі.",
      "lastName.placeholder": "Наприклад, Мельник",
      "email.description":
        "Поле доступне лише для перегляду, бо авторизація йде через Google.",
      "avatar.label": "Аватар",
      "avatar.description":
        "Оберіть квадратне або близьке до квадратного зображення для кращого вигляду.",
      save: "Зберегти профіль",
      "sessions.title": "Активні сесії",
      "sessions.description":
        "Переглядайте пристрої з доступом до акаунта та завершуйте непотрібні сесії.",
      "sessions.current": "Поточна",
      "sessions.lastActivity": "Остання активність:",
      "sessions.revoke": "Завершити",
      "sessions.logout": "Вийти",
      "sessions.revokeOthers": "Завершити інші",
      "sessions.loadError": "Не вдалося завантажити активні сесії.",
      "delete.sectionTitle": "Видалення акаунта",
      "delete.sectionDescription":
        "Ця дія незворотна. Буде видалено ваш акаунт, аватар і всі створені вами набори карток.",
      "delete.action": "Видалити акаунт",
      "delete.modalTitle": "Видалити акаунт?",
      "delete.modalDescription": "Відновити дані буде неможливо.",
      "delete.confirmPrompt": "Для підтвердження введіть свій email",
      "delete.confirmLabel": "Підтвердження email",
      "delete.confirmPlaceholder": "Ваш email",
      "delete.forever": "Видалити назавжди",
      "validation.firstName": "Вкажіть ім'я",
      "validation.lastName": "Вкажіть прізвище",
      "toast.deleted": "Акаунт видалено",
      "toast.deleteError": "Не вдалося видалити акаунт",
      "toast.updated": "Профіль оновлено",
      "toast.updateError": "Не вдалося зберегти профіль",
    },
    en: {
      "loadError.title": "Could not load profile",
      "loadError.description": "Try loading your profile again.",
      eyebrow: "Profile",
      title: "Your profile",
      description: "Update the name and avatar other QuizPet members can see.",
      "firstName.label": "First name",
      "firstName.description": "Used in your profile and user lists.",
      "firstName.placeholder": "For example, Peter",
      "lastName.label": "Last name",
      "lastName.description":
        "Used to display your full name in the interface.",
      "lastName.placeholder": "For example, Miller",
      "email.description":
        "This field is read-only because sign-in is handled by Google.",
      "avatar.label": "Avatar",
      "avatar.description":
        "Choose a square or nearly square image for the best result.",
      save: "Save profile",
      "sessions.title": "Active sessions",
      "sessions.description":
        "Review devices with account access and end sessions you no longer need.",
      "sessions.current": "Current",
      "sessions.lastActivity": "Last activity:",
      "sessions.revoke": "End session",
      "sessions.logout": "Log out",
      "sessions.revokeOthers": "End other sessions",
      "sessions.loadError": "Could not load active sessions.",
      "delete.sectionTitle": "Delete account",
      "delete.sectionDescription":
        "This action cannot be undone. Your account, avatar, and every set you created will be deleted.",
      "delete.action": "Delete account",
      "delete.modalTitle": "Delete account?",
      "delete.modalDescription": "The data cannot be restored.",
      "delete.confirmPrompt": "Enter your email to confirm",
      "delete.confirmLabel": "Confirm email",
      "delete.confirmPlaceholder": "Your email",
      "delete.forever": "Delete permanently",
      "validation.firstName": "Enter your first name",
      "validation.lastName": "Enter your last name",
      "toast.deleted": "Account deleted",
      "toast.deleteError": "Could not delete account",
      "toast.updated": "Profile updated",
      "toast.updateError": "Could not save profile",
    },
  },
  "widgets.sets-list-widget": {
    uk: {
      "hero.eyebrow": "Бібліотека карток",
      "hero.title": "Набори для швидкого повторення",
      "hero.description":
        "Перемикайтеся між власними наборами та всією доступною бібліотекою, відкривайте навчання або створюйте нову тему.",
      create: "Створити набір",
      "card.eyebrow": "Набір карток",
      "card.noDescription":
        "Опис ще не доданий, але набір уже готовий до наповнення.",
      "card.noTopics": "Без тематики",
      "card.cards": "Карток",
      "card.topics": "Тем",
      "card.author": "Створив",
      "card.learn": "Вчитись",
      "card.edit": "Редагувати набір",
      "card.delete": "Видалити набір",
      "grid.eyebrow": "Набори",
      "grid.errorTitle": "Не вдалося завантажити набори",
      "grid.errorDescription":
        "Спробуйте ще раз. Якщо проблема повторюється, варто перевірити доступність бекенду.",
      "grid.createFirst": "Створити перший набір",
      "grid.mineTitle": "Ваша колекція карток",
      "grid.allTitle": "Усі доступні картки",
      "grid.filteredEmptyTitle": "Нічого не знайдено",
      "grid.mineEmptyTitle": "У вас ще немає наборів",
      "grid.allEmptyTitle": "Поки що немає доступних наборів",
      "grid.filteredEmptyDescription":
        "Спробуйте змінити умови пошуку або очистити активні фільтри.",
      "grid.mineEmptyDescription":
        "Створіть перший набір: додайте тему, короткий опис і кілька карток.",
      "grid.allEmptyDescription":
        "Створіть перший набір, щоб він з’явився у спільній бібліотеці.",
      "scope.mine": "Мої набори",
      "scope.all": "Усі набори",
      "stats.mine": "Ваших наборів",
      "stats.all": "Усього наборів",
      "stats.topics": "Тем на сторінці",
      "stats.described": "З описом на сторінці",
      "summary.filteredEmpty": "За вибраними фільтрами наборів не знайдено.",
      "summary.mineEmpty":
        "Створіть перший набір і почніть збирати власну навчальну полицю.",
      "summary.allEmpty": "У бібліотеці поки немає доступних наборів.",
      "summary.mine":
        "{count} ваш набір уже готовий для повторення та подальшого наповнення. | {count} ваші набори у навчальній колекції. | {count} ваших наборів у навчальній колекції.",
      "summary.all":
        "{count} набір уже доступний для повторення. | {count} набори доступні в бібліотеці для швидкого повторення. | {count} наборів доступно в бібліотеці для швидкого повторення.",
      deleteConfirm: "Видалити набір «{name}»? Цю дію не можна скасувати.",
      "filters.clear": "Очистити фільтри",
      "filters.title": "Фільтри",
      "filters.description": "Звузьте бібліотеку за потрібними параметрами.",
      "filters.clearShort": "Очистити",
      "filters.name": "Назва набору",
      "filters.namePlaceholder": "Знайти набір",
      "filters.topic": "Тематика",
      "filters.allTopics": "Усі тематики",
      "filters.topicSearch": "Знайти тематику",
      "filters.englishLevel": "Рівень англійської",
      "filters.allLevels": "Усі рівні",
      "filters.levelSearch": "Знайти рівень",
      "filters.author": "Автор",
      "filters.allAuthors": "Усі автори",
      "filters.authorSearch": "Знайти автора",
      "filters.error": "Не вдалося завантажити параметри фільтрів.",
    },
    en: {
      "hero.eyebrow": "Flashcard library",
      "hero.title": "Sets for quick review",
      "hero.description":
        "Switch between your sets and the full library, start learning, or create a new topic.",
      create: "Create set",
      "card.eyebrow": "Flashcard set",
      "card.noDescription":
        "No description yet, but the set is ready for cards.",
      "card.noTopics": "No topics",
      "card.cards": "Cards",
      "card.topics": "Topics",
      "card.author": "Author",
      "card.learn": "Learn",
      "card.edit": "Edit set",
      "card.delete": "Delete set",
      "grid.eyebrow": "Sets",
      "grid.errorTitle": "Could not load sets",
      "grid.errorDescription":
        "Try again. If the problem continues, check whether the backend is available.",
      "grid.createFirst": "Create the first set",
      "grid.mineTitle": "Your flashcard collection",
      "grid.allTitle": "All available cards",
      "grid.filteredEmptyTitle": "Nothing found",
      "grid.mineEmptyTitle": "You do not have any sets yet",
      "grid.allEmptyTitle": "There are no available sets yet",
      "grid.filteredEmptyDescription":
        "Change the search criteria or clear the active filters.",
      "grid.mineEmptyDescription":
        "Create your first set with a topic, a short description, and a few cards.",
      "grid.allEmptyDescription":
        "Create the first set so it appears in the shared library.",
      "scope.mine": "My sets",
      "scope.all": "All sets",
      "stats.mine": "Your sets",
      "stats.all": "Total sets",
      "stats.topics": "Topics on this page",
      "stats.described": "With descriptions",
      "summary.filteredEmpty": "No sets match the selected filters.",
      "summary.mineEmpty":
        "Create your first set and start building your learning shelf.",
      "summary.allEmpty": "There are no available sets in the library yet.",
      "summary.mine":
        "{count} set in your learning collection. | {count} sets in your learning collection.",
      "summary.all":
        "{count} set is available for review. | {count} sets are available for review.",
      deleteConfirm: "Delete the set “{name}”? This action cannot be undone.",
      "filters.clear": "Clear filters",
      "filters.title": "Filters",
      "filters.description": "Narrow the library using the options you need.",
      "filters.clearShort": "Clear",
      "filters.name": "Set name",
      "filters.namePlaceholder": "Find a set",
      "filters.topic": "Topic",
      "filters.allTopics": "All topics",
      "filters.topicSearch": "Find a topic",
      "filters.englishLevel": "English level",
      "filters.allLevels": "All levels",
      "filters.levelSearch": "Find a level",
      "filters.author": "Author",
      "filters.allAuthors": "All authors",
      "filters.authorSearch": "Find an author",
      "filters.error": "Could not load filter options.",
    },
  },
  "widgets.create-set-widget": {
    uk: {
      create: "Створити набір",
      "form.changesReady": "Зміни готові до збереження",
      "form.draftSaved": "Чернетка зберігається",
      "form.name.label": "Назва набору",
      "form.name.description": "Коротка назва, яку легко впізнати.",
      "form.name.placeholder": "Наприклад, Basic Biology",
      "form.level.label": "Рівень англійської",
      "form.level.description": "За потреби оберіть рівень складності набору.",
      "form.level.error": "Не вдалося завантажити рівні",
      "form.level.clear": "Не вказувати рівень",
      "form.topics.label": "Тематика",
      "form.topics.description": "Оберіть щонайменше одну категорію.",
      "form.topics.error": "Не вдалося завантажити тематики",
      "form.description.label": "Опис",
      "form.description.description": "Що саме допоможе вивчити цей набір.",
      "form.description.placeholder": "Коротко опишіть тему або навчальну мету",
      "form.tip":
        "Найкраще запам’ятовуються короткі картки: одна думка, одна відповідь і лише необхідний контекст.",
      "form.cards.eyebrow": "Наповнення",
      "form.cards.title": "Картки набору",
      "form.cards.count": "{count} картка | {count} картки | {count} карток",
      "form.cards.add": "Додати картку",
      "form.editEyebrow": "Редагування набору",
      "form.newEyebrow": "Новий набір",
      "form.editTitle": "Оновити набір",
      "form.newTitle": "Створити набір карток",
      "form.editDescription":
        "Змініть основні дані або відредагуйте окремі картки.",
      "form.newDescription":
        "Додайте тему, короткий опис і щонайменше дві картки.",
      "cardForm.number": "Картка {number}",
      "cardForm.subtitle": "Термін і правильна відповідь",
      "cardForm.moveUp": "Перемістити картку вище",
      "cardForm.moveDown": "Перемістити картку нижче",
      "cardForm.delete": "Видалити картку",
      "cardForm.term.label": "Термін",
      "cardForm.term.description": "Слово, поняття або питання.",
      "cardForm.term.placeholder": "Наприклад, Photosynthesis",
      "cardForm.hint.label": "Підказка",
      "cardForm.hint.description": "Коротке уточнення до терміна.",
      "cardForm.hint.placeholder": "Необов’язковий контекст",
      "cardForm.definition.label": "Визначення",
      "cardForm.definition.description":
        "Пояснення, переклад або правильна відповідь.",
      "cardForm.definition.placeholder": "Дайте коротку й точну відповідь",
      "cardForm.appearance": "Зображення та оформлення",
      "cardForm.termImage.label": "Зображення терміна",
      "cardForm.termImage.description": "Необов’язкова візуальна підказка.",
      "cardForm.definitionImage.label": "Зображення відповіді",
      "cardForm.definitionImage.description":
        "Окрема ілюстрація для визначення.",
      "cardForm.textColor.label": "Колір тексту",
      "cardForm.textColor.description": "Залиште порожнім для кольору теми.",
      "cardForm.backgroundColor.label": "Колір фону",
      "cardForm.backgroundColor.description":
        "Залиште порожнім для стандартної поверхні.",
      "csv.title": "Робота з CSV",
      "csv.columnsPrefix": "Колонки:",
      "csv.and": "і",
      "csv.replaces": "Імпорт замінює поточні картки.",
      "csv.export": "Експорт",
      "csv.import": "Імпорт",
      "csv.error.empty":
        "CSV не містить жодного рядка з term, termDescription і definition.",
      "csv.toast.imported": "CSV імпортовано",
      "csv.toast.count":
        "Завантажено {count} картку. | Завантажено {count} картки. | Завантажено {count} карток.",
      "csv.toast.error": "Не вдалося імпортувати CSV",
      "csv.error.format": "Перевірте формат файлу.",
      "csv.error.headers":
        "CSV має містити заголовки term, termDescription і definition.",
      "csv.error.quotes": "CSV містить незакриті лапки.",
      "toast.updated": "Набір оновлено",
      "toast.created": "Набір створено",
      "toast.saveError": "Не вдалося зберегти набір",
      "toast.validationError": "Перевірте введені дані та спробуйте ще раз.",
      "toast.retryError": "Спробуйте повторити дію.",
      "filters.topicSearch": "Знайти тематику",
      "filters.levelSearch": "Знайти рівень",
    },
    en: {
      create: "Create set",
      "form.changesReady": "Changes are ready to save",
      "form.draftSaved": "Draft is saved locally",
      "form.name.label": "Set name",
      "form.name.description": "A short, recognizable name.",
      "form.name.placeholder": "For example, Basic Biology",
      "form.level.label": "English level",
      "form.level.description":
        "Optionally choose the difficulty level of the set.",
      "form.level.error": "Could not load levels",
      "form.level.clear": "Do not specify a level",
      "form.topics.label": "Topics",
      "form.topics.description": "Choose at least one category.",
      "form.topics.error": "Could not load topics",
      "form.description.label": "Description",
      "form.description.description": "What this set will help you learn.",
      "form.description.placeholder":
        "Briefly describe the topic or learning goal",
      "form.tip":
        "Short cards work best: one idea, one answer, and only the context you need.",
      "form.cards.eyebrow": "Content",
      "form.cards.title": "Set cards",
      "form.cards.count": "{count} card | {count} cards",
      "form.cards.add": "Add card",
      "form.editEyebrow": "Edit set",
      "form.newEyebrow": "New set",
      "form.editTitle": "Update set",
      "form.newTitle": "Create a flashcard set",
      "form.editDescription":
        "Update the basic details or edit individual cards.",
      "form.newDescription":
        "Add a topic, a short description, and at least two cards.",
      "cardForm.number": "Card {number}",
      "cardForm.subtitle": "Term and correct answer",
      "cardForm.moveUp": "Move card up",
      "cardForm.moveDown": "Move card down",
      "cardForm.delete": "Delete card",
      "cardForm.term.label": "Term",
      "cardForm.term.description": "A word, concept, or question.",
      "cardForm.term.placeholder": "For example, Photosynthesis",
      "cardForm.hint.label": "Hint",
      "cardForm.hint.description": "A short clarification for the term.",
      "cardForm.hint.placeholder": "Optional context",
      "cardForm.definition.label": "Definition",
      "cardForm.definition.description":
        "An explanation, translation, or correct answer.",
      "cardForm.definition.placeholder": "Give a short, precise answer",
      "cardForm.appearance": "Images and appearance",
      "cardForm.termImage.label": "Term image",
      "cardForm.termImage.description": "An optional visual hint.",
      "cardForm.definitionImage.label": "Answer image",
      "cardForm.definitionImage.description":
        "A separate illustration for the definition.",
      "cardForm.textColor.label": "Text color",
      "cardForm.textColor.description": "Leave empty to use the theme color.",
      "cardForm.backgroundColor.label": "Background color",
      "cardForm.backgroundColor.description":
        "Leave empty to use the default surface.",
      "csv.title": "CSV tools",
      "csv.columnsPrefix": "Columns:",
      "csv.and": "and",
      "csv.replaces": "Import replaces the current cards.",
      "csv.export": "Export",
      "csv.import": "Import",
      "csv.error.empty":
        "The CSV does not contain any rows with term, termDescription, and definition.",
      "csv.toast.imported": "CSV imported",
      "csv.toast.count": "Imported {count} card. | Imported {count} cards.",
      "csv.toast.error": "Could not import CSV",
      "csv.error.format": "Check the file format.",
      "csv.error.headers":
        "The CSV must include term, termDescription, and definition headers.",
      "csv.error.quotes": "The CSV contains an unclosed quote.",
      "toast.updated": "Set updated",
      "toast.created": "Set created",
      "toast.saveError": "Could not save set",
      "toast.validationError": "Check the entered data and try again.",
      "toast.retryError": "Try the action again.",
      "filters.topicSearch": "Find a topic",
      "filters.levelSearch": "Find a level",
    },
  },
  "widgets.set-edit-form-widget": {
    uk: {
      create: "Створити набір",
      "edit.loadError.title": "Не вдалося завантажити набір",
      "edit.loadError.description":
        "Спробуйте повторно відкрити редактор набору.",
      "form.changesReady": "Зміни готові до збереження",
      "form.draftSaved": "Чернетка зберігається",
      "form.name.label": "Назва набору",
      "form.name.description": "Коротка назва, яку легко впізнати.",
      "form.name.placeholder": "Наприклад, Basic Biology",
      "form.level.label": "Рівень англійської",
      "form.level.description": "За потреби оберіть рівень складності набору.",
      "form.level.error": "Не вдалося завантажити рівні",
      "form.level.clear": "Не вказувати рівень",
      "form.topics.label": "Тематика",
      "form.topics.description": "Оберіть щонайменше одну категорію.",
      "form.topics.error": "Не вдалося завантажити тематики",
      "form.description.label": "Опис",
      "form.description.description": "Що саме допоможе вивчити цей набір.",
      "form.description.placeholder": "Коротко опишіть тему або навчальну мету",
      "form.tip":
        "Найкраще запам’ятовуються короткі картки: одна думка, одна відповідь і лише необхідний контекст.",
      "form.cards.eyebrow": "Наповнення",
      "form.cards.title": "Картки набору",
      "form.cards.count": "{count} картка | {count} картки | {count} карток",
      "form.cards.add": "Додати картку",
      "form.editEyebrow": "Редагування набору",
      "form.newEyebrow": "Новий набір",
      "form.editTitle": "Оновити набір",
      "form.newTitle": "Створити набір карток",
      "form.editDescription":
        "Змініть основні дані або відредагуйте окремі картки.",
      "form.newDescription":
        "Додайте тему, короткий опис і щонайменше дві картки.",
      "form.loading": "Завантаження редактора набору",
      "cardForm.number": "Картка {number}",
      "cardForm.subtitle": "Термін і правильна відповідь",
      "cardForm.moveUp": "Перемістити картку вище",
      "cardForm.moveDown": "Перемістити картку нижче",
      "cardForm.delete": "Видалити картку",
      "cardForm.term.label": "Термін",
      "cardForm.term.description": "Слово, поняття або питання.",
      "cardForm.term.placeholder": "Наприклад, Photosynthesis",
      "cardForm.hint.label": "Підказка",
      "cardForm.hint.description": "Коротке уточнення до терміна.",
      "cardForm.hint.placeholder": "Необов’язковий контекст",
      "cardForm.definition.label": "Визначення",
      "cardForm.definition.description":
        "Пояснення, переклад або правильна відповідь.",
      "cardForm.definition.placeholder": "Дайте коротку й точну відповідь",
      "cardForm.appearance": "Зображення та оформлення",
      "cardForm.termImage.label": "Зображення терміна",
      "cardForm.termImage.description": "Необов’язкова візуальна підказка.",
      "cardForm.definitionImage.label": "Зображення відповіді",
      "cardForm.definitionImage.description":
        "Окрема ілюстрація для визначення.",
      "cardForm.textColor.label": "Колір тексту",
      "cardForm.textColor.description": "Залиште порожнім для кольору теми.",
      "cardForm.backgroundColor.label": "Колір фону",
      "cardForm.backgroundColor.description":
        "Залиште порожнім для стандартної поверхні.",
      "csv.title": "Робота з CSV",
      "csv.columnsPrefix": "Колонки:",
      "csv.and": "і",
      "csv.replaces": "Імпорт замінює поточні картки.",
      "csv.export": "Експорт",
      "csv.import": "Імпорт",
      "csv.error.empty":
        "CSV не містить жодного рядка з term, termDescription і definition.",
      "csv.toast.imported": "CSV імпортовано",
      "csv.toast.count":
        "Завантажено {count} картку. | Завантажено {count} картки. | Завантажено {count} карток.",
      "csv.toast.error": "Не вдалося імпортувати CSV",
      "csv.error.format": "Перевірте формат файлу.",
      "csv.error.headers":
        "CSV має містити заголовки term, termDescription і definition.",
      "csv.error.quotes": "CSV містить незакриті лапки.",
      "toast.updated": "Набір оновлено",
      "toast.created": "Набір створено",
      "toast.saveError": "Не вдалося зберегти набір",
      "toast.validationError": "Перевірте введені дані та спробуйте ще раз.",
      "toast.retryError": "Спробуйте повторити дію.",
      "filters.topicSearch": "Знайти тематику",
      "filters.levelSearch": "Знайти рівень",
    },
    en: {
      create: "Create set",
      "edit.loadError.title": "Could not load set",
      "edit.loadError.description": "Try opening the set editor again.",
      "form.changesReady": "Changes are ready to save",
      "form.draftSaved": "Draft is saved locally",
      "form.name.label": "Set name",
      "form.name.description": "A short, recognizable name.",
      "form.name.placeholder": "For example, Basic Biology",
      "form.level.label": "English level",
      "form.level.description":
        "Optionally choose the difficulty level of the set.",
      "form.level.error": "Could not load levels",
      "form.level.clear": "Do not specify a level",
      "form.topics.label": "Topics",
      "form.topics.description": "Choose at least one category.",
      "form.topics.error": "Could not load topics",
      "form.description.label": "Description",
      "form.description.description": "What this set will help you learn.",
      "form.description.placeholder":
        "Briefly describe the topic or learning goal",
      "form.tip":
        "Short cards work best: one idea, one answer, and only the context you need.",
      "form.cards.eyebrow": "Content",
      "form.cards.title": "Set cards",
      "form.cards.count": "{count} card | {count} cards",
      "form.cards.add": "Add card",
      "form.editEyebrow": "Edit set",
      "form.newEyebrow": "New set",
      "form.editTitle": "Update set",
      "form.newTitle": "Create a flashcard set",
      "form.editDescription":
        "Update the basic details or edit individual cards.",
      "form.newDescription":
        "Add a topic, a short description, and at least two cards.",
      "form.loading": "Loading set editor",
      "cardForm.number": "Card {number}",
      "cardForm.subtitle": "Term and correct answer",
      "cardForm.moveUp": "Move card up",
      "cardForm.moveDown": "Move card down",
      "cardForm.delete": "Delete card",
      "cardForm.term.label": "Term",
      "cardForm.term.description": "A word, concept, or question.",
      "cardForm.term.placeholder": "For example, Photosynthesis",
      "cardForm.hint.label": "Hint",
      "cardForm.hint.description": "A short clarification for the term.",
      "cardForm.hint.placeholder": "Optional context",
      "cardForm.definition.label": "Definition",
      "cardForm.definition.description":
        "An explanation, translation, or correct answer.",
      "cardForm.definition.placeholder": "Give a short, precise answer",
      "cardForm.appearance": "Images and appearance",
      "cardForm.termImage.label": "Term image",
      "cardForm.termImage.description": "An optional visual hint.",
      "cardForm.definitionImage.label": "Answer image",
      "cardForm.definitionImage.description":
        "A separate illustration for the definition.",
      "cardForm.textColor.label": "Text color",
      "cardForm.textColor.description": "Leave empty to use the theme color.",
      "cardForm.backgroundColor.label": "Background color",
      "cardForm.backgroundColor.description":
        "Leave empty to use the default surface.",
      "csv.title": "CSV tools",
      "csv.columnsPrefix": "Columns:",
      "csv.and": "and",
      "csv.replaces": "Import replaces the current cards.",
      "csv.export": "Export",
      "csv.import": "Import",
      "csv.error.empty":
        "The CSV does not contain any rows with term, termDescription, and definition.",
      "csv.toast.imported": "CSV imported",
      "csv.toast.count": "Imported {count} card. | Imported {count} cards.",
      "csv.toast.error": "Could not import CSV",
      "csv.error.format": "Check the file format.",
      "csv.error.headers":
        "The CSV must include term, termDescription, and definition headers.",
      "csv.error.quotes": "The CSV contains an unclosed quote.",
      "toast.updated": "Set updated",
      "toast.created": "Set created",
      "toast.saveError": "Could not save set",
      "toast.validationError": "Check the entered data and try again.",
      "toast.retryError": "Try the action again.",
      "filters.topicSearch": "Find a topic",
      "filters.levelSearch": "Find a level",
    },
  },
  "widgets.learn-widget": {
    uk: {
      "loadError.title": "Не вдалося завантажити набір",
      "loadError.description":
        "Спробуйте оновити сторінку або повторно звернутися до сервера.",
      empty: "У наборі поки немає карток",
      missed: "Не знаю",
      known: "Знаю",
      knownNext: "Знаю, далі",
      "progress.empty": "Немає карток для проходження",
      "progress.step": "Крок {current} з {total}",
      "progress.learned": "Засвоєно",
      "progress.repeats": "Повтори",
      "progress.session": "Сеанс",
      "speech.stop": "Зупинити озвучення",
      "speech.start": "Озвучити картку",
      editCard: "Редагувати картку",
      "fullscreen.exit": "Вийти з повного екрана",
      "fullscreen.enter": "Повний екран",
      showTerm: "Показати термін",
      showAnswer: "Показати відповідь",
      term: "Термін",
      answer: "Відповідь",
      "hints.controlsAria": "Підказки та керування з клавіатури",
      "hints.flip": "Натисніть картку, щоб побачити іншу сторону",
      "hints.space": "Пробіл",
      "hints.flipCard": "Перевернути картку",
      "hints.swipe": "Свайп вправо — не знаю, вліво — знаю",
      "hints.corner": "Кут картки",
      "hints.answerAria": "Підказка: перша літера відповіді",
      "hints.title": "Підказка",
      "hints.description": "Перша літера відповіді — решту згадайте самі.",
      "results.eyebrow": "Результати",
      "results.restart": "Пройти ще раз",
      "results.retryMistakes": "Повторити лише складні",
      "results.reviewEyebrow": "Розбір карток",
      "results.reviewTitle": "Де було легко, а де варто ще пройтись",
      "results.cardCount":
        "{count} картка у підсумку | {count} картки у підсумку | {count} карток у підсумку",
      "results.mistakes": "Було помилок: {count}",
      "results.noMistakes": "Без помилок",
      "results.attempts": "Спроб",
      "results.time": "Час",
      "results.average": "Середнє",
      "results.headingEmpty": "Підсумок з'явиться після проходження",
      "results.headingPerfect": "Ідеальний прохід без помилок",
      "results.headingReview": "Сеанс завершено, є що закріпити",
      "results.summaryEmpty":
        "Додайте картки в набір і поверніться до режиму навчання.",
      "results.summaryPerfect":
        "Усі картки були закриті без промахів. Можна або піти далі, або пройти набір ще раз для закріплення темпу.",
      "results.summaryReview":
        "{count} картка потребувала повторення. Нижче видно затримки та кількість спроб. | {count} картки потребували повторення. Нижче видно затримки та кількість спроб. | {count} карток потребували повторення. Нижче видно затримки та кількість спроб.",
      "results.accuracy": "Точність",
      "results.firstTry": "З першого разу",
      "results.totalTime": "Загальний час",
      "results.averageTime": "Середній час",
      "study.modes": "Режими навчання",
      "study.backToSets": "Назад до наборів",
      "study.learn": "Навчання",
      "study.match": "Match",
      "cardForm.number": "Картка {number}",
    },
    en: {
      "loadError.title": "Could not load set",
      "loadError.description":
        "Refresh the page or try the server request again.",
      empty: "This set does not have any cards yet",
      missed: "Not yet",
      known: "I know it",
      knownNext: "I know it, next",
      "progress.empty": "There are no cards to study",
      "progress.step": "Step {current} of {total}",
      "progress.learned": "Learned",
      "progress.repeats": "Repeats",
      "progress.session": "Session",
      "speech.stop": "Stop speaking",
      "speech.start": "Read card aloud",
      editCard: "Edit card",
      "fullscreen.exit": "Exit full screen",
      "fullscreen.enter": "Full screen",
      showTerm: "Show term",
      showAnswer: "Show answer",
      term: "Term",
      answer: "Answer",
      "hints.controlsAria": "Hints and keyboard controls",
      "hints.flip": "Select the card to see the other side",
      "hints.space": "Space",
      "hints.flipCard": "Flip card",
      "hints.swipe": "Swipe right for not yet, left for known",
      "hints.corner": "Card corner",
      "hints.answerAria": "Hint: first letter of the answer",
      "hints.title": "Hint",
      "hints.description":
        "The first letter is shown; recall the rest yourself.",
      "results.eyebrow": "Results",
      "results.restart": "Study again",
      "results.retryMistakes": "Repeat difficult cards",
      "results.reviewEyebrow": "Card review",
      "results.reviewTitle": "What was easy and what needs another pass",
      "results.cardCount":
        "{count} card in the summary | {count} cards in the summary",
      "results.mistakes": "Mistakes: {count}",
      "results.noMistakes": "No mistakes",
      "results.attempts": "Attempts",
      "results.time": "Time",
      "results.average": "Average",
      "results.headingEmpty": "Your summary will appear after the session",
      "results.headingPerfect": "A perfect session with no mistakes",
      "results.headingReview":
        "Session complete, with a few things to reinforce",
      "results.summaryEmpty": "Add cards to the set and return to study mode.",
      "results.summaryPerfect":
        "You completed every card without a miss. Move on or study the set again to reinforce your pace.",
      "results.summaryReview":
        "{count} card needed repetition. The details below show delays and attempts. | {count} cards needed repetition. The details below show delays and attempts.",
      "results.accuracy": "Accuracy",
      "results.firstTry": "First try",
      "results.totalTime": "Total time",
      "results.averageTime": "Average time",
      "study.modes": "Study modes",
      "study.backToSets": "Back to sets",
      "study.learn": "Learn",
      "study.match": "Match",
      "cardForm.number": "Card {number}",
    },
  },
  "widgets.match-widget": {
    uk: {
      round: "Раунд {current} з {total}",
      pairsProgress: "{matched} / {total} пар",
      nextRound: "Наступний раунд",
      words: "Слова",
      definitions: "Визначення",
      "feedback.error": "Не збігається. Спробуйте іншу пару.",
      "feedback.success": "Правильна пара!",
      "feedback.roundComplete": "Усі пари цього раунду знайдені.",
      "feedback.choosePair": "Тепер оберіть відповідник в іншій колонці.",
      "feedback.start": "Оберіть слово або визначення, щоб почати.",
      tileMatched: "{text}: знайдено пару",
      "results.title": "Усі пари знайдено!",
      "results.playAgain": "Зіграти ще раз",
      "results.continueLearn": "Продовжити в Learn",
      "metrics.matched": "Знайдено",
      "metrics.time": "Час",
      "metrics.mistakes": "Помилки",
      "metrics.accuracy": "Точність",
      "loadError.title": "Не вдалося завантажити набір",
      "loadError.description": "Спробуйте ще раз.",
      loading: "Завантаження Match",
      "empty.title": "Поки немає слів для Match",
      "empty.description":
        "Додайте картки зі словом і визначенням, щоб почати.",
      "empty.action": "Додати картки",
      eyebrow: "Пошук пар",
      intro:
        "Знайдіть визначення для кожного слова. Пройдіть {count} пар раундами до {size}. Таймер запуститься на початку гри.",
      start: "Почати Match",
      keyboardHint: "Натискайте на картки або використовуйте Tab і Enter.",
      restart: "Почати заново",
      "study.modes": "Режими навчання",
      "study.backToSets": "Назад до наборів",
      "study.learn": "Навчання",
      "study.match": "Match",
    },
    en: {
      round: "Round {current} of {total}",
      pairsProgress: "{matched} / {total} pairs",
      nextRound: "Next round",
      words: "Words",
      definitions: "Definitions",
      "feedback.error": "Not a match. Try another pair.",
      "feedback.success": "Correct match!",
      "feedback.roundComplete": "All pairs in this round matched.",
      "feedback.choosePair":
        "Now choose the matching item in the other column.",
      "feedback.start": "Choose a word or definition to begin.",
      tileMatched: "{text}: matched",
      "results.title": "Every pair matched!",
      "results.playAgain": "Play again",
      "results.continueLearn": "Continue with Learn",
      "metrics.matched": "Pairs matched",
      "metrics.time": "Time",
      "metrics.mistakes": "Mistakes",
      "metrics.accuracy": "Accuracy",
      "loadError.title": "Unable to load this set",
      "loadError.description": "Please try again.",
      loading: "Loading matching session",
      "empty.title": "No words to match yet",
      "empty.description":
        "Add cards with both a word and a definition to start matching.",
      "empty.action": "Add cards",
      eyebrow: "Word match",
      intro:
        "Match each word with its definition. Work through {count} pairs in rounds of up to {size}. Your timer starts when you play.",
      start: "Start matching",
      keyboardHint: "Tap to select, or use Tab and Enter on your keyboard.",
      restart: "Restart matching",
      "study.modes": "Study modes",
      "study.backToSets": "Back to sets",
      "study.learn": "Learn",
      "study.match": "Match",
    },
  },
};

const legacyWidgetTranslationSources: Partial<
  Record<TFunctionalWidgetUid, readonly TWidgetTranslationSource[]>
> = {
  "widgets.home-widget": [["home.", ""]],
  "widgets.login-widget": [["login.", ""]],
  "widgets.people-hero-widget": [["people.hero.", ""]],
  "widgets.people-grid-widget": [["people.grid.", ""]],
  "widgets.pitanyachka-widget": [["pitanyachka.", ""]],
  "widgets.profile-widget": [["profile.", ""]],
  "widgets.sets-list-widget": [
    ["sets.hero.", "hero."],
    ["sets.create", "create"],
    ["sets.card.", "card."],
    ["sets.grid.", "grid."],
    ["sets.scope.", "scope."],
    ["sets.stats.", "stats."],
    ["sets.summary.", "summary."],
    ["sets.deleteConfirm", "deleteConfirm"],
    ["sets.filters.", "filters."],
  ],
  "widgets.create-set-widget": [
    ["sets.create", "create"],
    ["sets.form.", "form."],
    ["sets.cardForm.", "cardForm."],
    ["sets.csv.", "csv."],
    ["sets.toast.", "toast."],
    ["sets.filters.topicSearch", "filters.topicSearch"],
    ["sets.filters.levelSearch", "filters.levelSearch"],
  ],
  "widgets.set-edit-form-widget": [
    ["sets.create", "create"],
    ["sets.edit.", "edit."],
    ["sets.form.", "form."],
    ["sets.cardForm.", "cardForm."],
    ["sets.csv.", "csv."],
    ["sets.toast.", "toast."],
    ["sets.filters.topicSearch", "filters.topicSearch"],
    ["sets.filters.levelSearch", "filters.levelSearch"],
  ],
  "widgets.learn-widget": [
    ["learn.", ""],
    ["study.", "study."],
    ["sets.cardForm.number", "cardForm.number"],
  ],
  "widgets.match-widget": [
    ["match.", ""],
    ["study.", "study."],
  ],
};

const legacyWidgetTranslationsFrom = (
  uid: string,
  values: Record<string, string>,
) =>
  (legacyWidgetTranslationSources[uid as TFunctionalWidgetUid] ?? []).flatMap(
    ([sourceKey, target]) =>
      Object.entries(values)
        .filter(([key]) =>
          sourceKey.endsWith(".")
            ? key.startsWith(sourceKey)
            : key === sourceKey,
        )
        .map(([key, value]) => ({
          key: `${target}${key.slice(sourceKey.length)}`,
          value,
        })),
  );

export const widgetTranslations = (uid: string, locale: TLocale) =>
  Object.entries(
    widgetTranslationValues[uid as TFunctionalWidgetUid]?.[locale] ?? {},
  ).map(([key, value]) => ({ key, value }));

export const widgetTranslationsWithLegacyValues = (
  uid: string,
  locale: TLocale,
  legacyValues: Record<string, string>,
) => {
  const values = Object.fromEntries(
    widgetTranslations(uid, locale).map(({ key, value }) => [key, value]),
  );

  for (const { key, value } of legacyWidgetTranslationsFrom(
    uid,
    legacyValues,
  )) {
    values[key] = value;
  }

  return Object.entries(values).map(([key, value]) => ({ key, value }));
};
