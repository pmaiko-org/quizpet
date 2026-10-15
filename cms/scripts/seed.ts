import { compileStrapi, createStrapi } from "@strapi/strapi";
import type { Core } from "@strapi/strapi";

type TLocale = "uk" | "en";
type TAccess = "public" | "authenticated" | "guestOnly";
type TLayout = "default" | "landing" | "cabinet" | "empty";
type TBlocksBody = Array<{
  type: "paragraph";
  children: Array<{ type: "text"; text: string }>;
}>;
type TLinkBlock = {
  label: string;
  url: string;
  isExternal: boolean;
};
type TBlock =
  | {
      __component: "widgets.hero-widget";
      eyebrow?: string;
      title: string;
      summary: string;
      imageUrl: string;
      imageAlt: string;
      primaryLink?: TLinkBlock;
      secondaryLink?: TLinkBlock;
    }
  | {
      __component: "widgets.feature-grid-widget";
      eyebrow?: string;
      title: string;
      summary?: string;
      anchor?: string;
      items: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
      variant: "cards" | "steps";
      tone: "default" | "tinted";
    }
  | {
      __component: "widgets.spotlight-widget";
      eyebrow?: string;
      title: string;
      summary: string;
      imageUrl: string;
      imageAlt: string;
      orientation: "image-left" | "image-right";
      accent: "blue" | "amber" | "green";
      primaryLink?: TLinkBlock;
    }
  | {
      __component: "widgets.slider-widget";
      eyebrow?: string;
      title: string;
      summary?: string;
      slides: Array<{
        eyebrow?: string;
        title: string;
        description: string;
        imageUrl: string;
        imageAlt: string;
        icon: string;
      }>;
      autoplay: boolean;
    }
  | {
      __component: "widgets.heading-widget";
      eyebrow?: string;
      title: string;
      summary?: string;
      align: "left" | "center";
    }
  | {
      __component: "widgets.rich-text-widget";
      body: TBlocksBody;
      width: "narrow" | "default" | "full";
    }
  | {
      __component: "widgets.callout-widget";
      title: string;
      body: TBlocksBody;
      variant: "info" | "success" | "warning" | "error";
      icon?: string;
      primaryLink?: TLinkBlock;
      secondaryLink?: TLinkBlock;
    }
  | {
      __component:
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
    };

type TPageSeed = {
  routeName: string;
  path: Record<TLocale, string>;
  title: Record<TLocale, string>;
  parent?: string;
  access: TAccess;
  layout: TLayout;
  blocks: Record<TLocale, TBlock[]>;
  showBreadcrumbs?: boolean;
  noIndex?: boolean;
};

const paragraph = (text: string): TBlocksBody => [
  { type: "paragraph", children: [{ type: "text", text }] },
];

const richText = (paragraphs: string[]): TBlocksBody =>
  paragraphs.map((text) => ({
    type: "paragraph",
    children: [{ type: "text", text }],
  }));

const functionalBlock = (
  name:
    | "home"
    | "login"
    | "people-hero"
    | "people-grid"
    | "pitanyachka"
    | "profile"
    | "sets-list"
    | "create-set"
    | "set-edit-form"
    | "learn"
    | "match",
): TBlock => ({ __component: `widgets.${name}-widget` });

const pages: TPageSeed[] = [
  {
    routeName: "index",
    path: { uk: "/", en: "/" },
    title: { uk: "Головна", en: "Home" },
    access: "public",
    layout: "landing",
    showBreadcrumbs: false,
    blocks: {
      uk: [
        {
          __component: "widgets.hero-widget",
          eyebrow: "QuizPet · навчання у власному ритмі",
          title: "Перетворюйте цікавість на знання",
          summary:
            "Створюйте картки, тренуйте пам’ять у Learn і Match та повертайтеся до важливого саме тоді, коли це потрібно.",
          imageUrl: "/2FPjlAyMQTA.jpg",
          imageAlt: "Друзі навчаються разом за ноутбуком",
          primaryLink: {
            label: "Почати безкоштовно",
            url: "/login",
            isExternal: false,
          },
          secondaryLink: {
            label: "Дізнатися більше",
            url: "#possibilities",
            isExternal: false,
          },
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Можливості",
          title: "Усе необхідне для впевненого прогресу",
          anchor: "possibilities",
          summary:
            "Від першої картки до завершеного навчального сеансу — без зайвих налаштувань і складних сценаріїв.",
          items: [
            {
              title: "Власні набори",
              description:
                "Збирайте терміни, визначення й теми у зрозумілу особисту бібліотеку.",
              icon: "i-lucide-layers-3",
            },
            {
              title: "Режим Learn",
              description:
                "Повторюйте картки у комфортному темпі та одразу бачте свій результат.",
              icon: "i-lucide-brain",
            },
            {
              title: "Гра Match",
              description:
                "Закріплюйте матеріал, знаходячи пари слів і визначень на швидкість.",
              icon: "i-lucide-puzzle",
            },
          ],
          variant: "cards",
          tone: "default",
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Ваша база знань",
          title: "Створюйте картки, до яких хочеться повертатися",
          summary:
            "Збирайте нові слова, формули й ключові поняття в охайні набори. QuizPet залишає фокус на змісті, а не на налаштуваннях.",
          imageUrl: "/landing/create-flashcards.jpg",
          imageAlt: "Студентка створює навчальні картки за ноутбуком",
          orientation: "image-left",
          accent: "amber",
          primaryLink: {
            label: "Створити перший набір",
            url: "/login",
            isExternal: false,
          },
        },
        {
          __component: "widgets.slider-widget",
          eyebrow: "Один сервіс — різні сценарії",
          title: "Перемикайтеся між форматами, а не між десятком інструментів",
          summary:
            "Гортайте, щоб побачити, як QuizPet супроводжує шлях від створення матеріалу до спільної практики.",
          slides: [
            {
              eyebrow: "Організація",
              title: "Зберіть тему в зрозумілий набір",
              description:
                "Перетворіть нотатки, терміни або нові слова на картки, які легко доповнювати й повторювати.",
              imageUrl: "/landing/commute-learning.jpg",
              imageAlt: "Студентка повторює матеріал у ранковому потязі",
              icon: "i-lucide-layout-dashboard",
            },
            {
              eyebrow: "Практика",
              title: "Додайте швидкості у режимі Match",
              description:
                "Поєднуйте слова з визначеннями, тренуйте згадування й одразу починайте наступний раунд.",
              imageUrl: "/landing/curiosity-lab.jpg",
              imageAlt: "Дослідниця впорядковує ботанічні матеріали за робочим столом",
              icon: "i-lucide-timer-reset",
            },
            {
              eyebrow: "Спільнота",
              title: "Підтримуйте навчальний ритм разом",
              description:
                "Діліться мотивацією, знаходьте людей зі схожими цілями й не випадайте з практики.",
              imageUrl: "/landing/team-workshop.jpg",
              imageAlt: "Команда працює з ідеями на вечірньому воркшопі",
              icon: "i-lucide-users-round",
            },
          ],
          autoplay: true,
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Простий старт",
          title: "Від ідеї до першого повторення за три кроки",
          anchor: "how-it-works",
          summary: "QuizPet не змушує вивчати інструмент замість матеріалу.",
          items: [
            {
              title: "Створіть набір",
              description: "Дайте йому назву, тему та рівень складності.",
              icon: "i-lucide-plus",
            },
            {
              title: "Додайте картки",
              description: "Запишіть поняття й короткі, точні пояснення.",
              icon: "i-lucide-file-stack",
            },
            {
              title: "Тренуйтеся",
              description: "Оберіть Learn або Match і закріпіть нові знання.",
              icon: "i-lucide-play",
            },
          ],
          variant: "steps",
          tone: "tinted",
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Навчання як гра",
          title: "Знаходьте правильні пари й тримайте темп",
          summary:
            "Match перетворює повторення на коротку динамічну сесію. Ви одразу бачите результат і можете спробувати ще раз без зайвих переходів.",
          imageUrl: "/landing/match-session.jpg",
          imageAlt: "Руки складають пари кольорових навчальних карток",
          orientation: "image-right",
          accent: "blue",
          primaryLink: {
            label: "Спробувати Match",
            url: "/login",
            isExternal: false,
          },
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Ваш темп",
          title: "Підходить для коротких і довгих навчальних цілей",
          summary:
            "Вивчайте мову, готуйтеся до іспиту або збирайте професійні терміни — структура залишається простою.",
          items: [
            {
              title: "Щоденна практика",
              description: "Короткі сесії легко поміщаються навіть у насичений день.",
              icon: "i-lucide-calendar-check-2",
            },
            {
              title: "Підготовка до іспитів",
              description: "Групуйте великі теми й повертайтеся до складних карток.",
              icon: "i-lucide-graduation-cap",
            },
            {
              title: "Спільне навчання",
              description: "Знаходьте людей і надихайтеся навчальною спільнотою.",
              icon: "i-lucide-users",
            },
          ],
          variant: "cards",
          tone: "default",
        },
        {
          __component: "widgets.callout-widget",
          title: "Ваші дані — це ваші дані",
          body: paragraph(
            "Ми використовуємо лише інформацію, потрібну для входу, профілю та створеного вами навчального контенту.",
          ),
          variant: "success",
          icon: "i-lucide-shield-check",
          primaryLink: {
            label: "Політика конфіденційності",
            url: "/privacy",
            isExternal: false,
          },
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Разом цікавіше",
          title: "Навчайтеся поруч із людьми, які теж рухаються вперед",
          summary:
            "Знаходьте інших користувачів, діліться мотивацією та перетворюйте особисту практику на живий навчальний ритм.",
          imageUrl: "/landing/study-together.jpg",
          imageAlt: "Друзі навчаються разом із планшетом і картками",
          orientation: "image-left",
          accent: "green",
        },
        {
          __component: "widgets.rich-text-widget",
          body: richText([
            "Навчання працює краще, коли прогрес відчувається. QuizPet прибирає зайве між вами та матеріалом: відкрили набір, зробили кілька повторень, побачили результат і продовжили свій день.",
            "Ваші набори залишаються впорядкованими, а режими тренування допомагають чергувати спокійне повторення з активною грою.",
          ]),
          width: "narrow",
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Для реальних завдань",
          title: "Один простір для різних навчальних цілей",
          summary:
            "QuizPet однаково добре працює для короткого щоденного повторення й великої теми, яку потрібно опанувати поступово.",
          items: [
            {
              title: "Нова мова",
              description: "Збирайте лексику за темами й регулярно повертайтеся до складних слів.",
              icon: "i-lucide-languages",
            },
            {
              title: "Іспит або співбесіда",
              description: "Розкладайте великий матеріал на короткі питання та точні відповіді.",
              icon: "i-lucide-badge-check",
            },
            {
              title: "Професійні знання",
              description: "Тримайте під рукою терміни, правила й поняття, потрібні у роботі.",
              icon: "i-lucide-briefcase-business",
            },
          ],
          variant: "cards",
          tone: "tinted",
        },
        {
          __component: "widgets.callout-widget",
          title: "Готові перетворити першу тему на набір?",
          body: paragraph(
            "Увійдіть через Google, додайте кілька карток і почніть перше тренування вже сьогодні.",
          ),
          variant: "info",
          icon: "i-lucide-sparkles",
          primaryLink: {
            label: "Почати навчання",
            url: "/login",
            isExternal: false,
          },
        },
      ],
      en: [
        {
          __component: "widgets.hero-widget",
          eyebrow: "QuizPet · learning at your pace",
          title: "Turn curiosity into knowledge",
          summary:
            "Create flashcards, train your memory with Learn and Match, and return to important ideas exactly when you need them.",
          imageUrl: "/2FPjlAyMQTA.jpg",
          imageAlt: "Friends learning together around a laptop",
          primaryLink: {
            label: "Start for free",
            url: "/login",
            isExternal: false,
          },
          secondaryLink: {
            label: "Explore features",
            url: "#possibilities",
            isExternal: false,
          },
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Possibilities",
          title: "Everything you need for steady progress",
          anchor: "possibilities",
          summary:
            "From your first card to a completed study session, without unnecessary settings or complicated workflows.",
          items: [
            {
              title: "Personal sets",
              description:
                "Organize terms, definitions, and topics in a clear personal library.",
              icon: "i-lucide-layers-3",
            },
            {
              title: "Learn mode",
              description:
                "Review cards at a comfortable pace and see your results immediately.",
              icon: "i-lucide-brain",
            },
            {
              title: "Match game",
              description:
                "Reinforce material by matching words and definitions against the clock.",
              icon: "i-lucide-puzzle",
            },
          ],
          variant: "cards",
          tone: "default",
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Your knowledge base",
          title: "Create flashcards you will actually want to revisit",
          summary:
            "Collect new words, formulas, and key ideas in tidy sets. QuizPet keeps the focus on your material instead of configuration.",
          imageUrl: "/landing/create-flashcards.jpg",
          imageAlt: "A student creating study cards on a laptop",
          orientation: "image-left",
          accent: "amber",
          primaryLink: {
            label: "Create your first set",
            url: "/login",
            isExternal: false,
          },
        },
        {
          __component: "widgets.slider-widget",
          eyebrow: "One service, different workflows",
          title: "Switch between learning formats, not a dozen tools",
          summary:
            "Browse the slides to see how QuizPet supports the path from creating material to practicing together.",
          slides: [
            {
              eyebrow: "Organization",
              title: "Turn a topic into a clear, reusable set",
              description:
                "Convert notes, terminology, or new words into cards that are easy to expand and revisit.",
              imageUrl: "/landing/commute-learning.jpg",
              imageAlt: "A student reviews material during a morning train ride",
              icon: "i-lucide-layout-dashboard",
            },
            {
              eyebrow: "Practice",
              title: "Add speed with Match mode",
              description:
                "Pair words with definitions, train recall, and jump straight into the next round.",
              imageUrl: "/landing/curiosity-lab.jpg",
              imageAlt: "A researcher organizes botanical material at a studio desk",
              icon: "i-lucide-timer-reset",
            },
            {
              eyebrow: "Community",
              title: "Keep your learning rhythm together",
              description:
                "Share motivation, find people with similar goals, and keep your practice moving.",
              imageUrl: "/landing/team-workshop.jpg",
              imageAlt: "A team develops ideas together during an evening workshop",
              icon: "i-lucide-users-round",
            },
          ],
          autoplay: true,
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "A simple start",
          title: "From an idea to your first review in three steps",
          anchor: "how-it-works",
          summary: "QuizPet never makes you learn the tool instead of the material.",
          items: [
            {
              title: "Create a set",
              description: "Give it a name, topic, and difficulty level.",
              icon: "i-lucide-plus",
            },
            {
              title: "Add cards",
              description: "Write down concepts and short, precise explanations.",
              icon: "i-lucide-file-stack",
            },
            {
              title: "Start practicing",
              description: "Choose Learn or Match and reinforce what you know.",
              icon: "i-lucide-play",
            },
          ],
          variant: "steps",
          tone: "tinted",
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Learning as a game",
          title: "Find the right pairs and keep your momentum",
          summary:
            "Match turns review into a short, energetic session. See the result immediately and jump into another round without unnecessary steps.",
          imageUrl: "/landing/match-session.jpg",
          imageAlt: "Hands matching colorful study cards",
          orientation: "image-right",
          accent: "blue",
          primaryLink: {
            label: "Try Match",
            url: "/login",
            isExternal: false,
          },
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Your pace",
          title: "Built for short sessions and ambitious goals",
          summary:
            "Learn a language, prepare for an exam, or collect professional terms while keeping the structure simple.",
          items: [
            {
              title: "Daily practice",
              description: "Short sessions fit naturally into even a busy day.",
              icon: "i-lucide-calendar-check-2",
            },
            {
              title: "Exam preparation",
              description: "Break down large topics and revisit difficult cards.",
              icon: "i-lucide-graduation-cap",
            },
            {
              title: "Learning together",
              description: "Find people and stay inspired by a learning community.",
              icon: "i-lucide-users",
            },
          ],
          variant: "cards",
          tone: "default",
        },
        {
          __component: "widgets.callout-widget",
          title: "Your data stays yours",
          body: paragraph(
            "We only use the information required for sign-in, your profile, and the learning content you create.",
          ),
          variant: "success",
          icon: "i-lucide-shield-check",
          primaryLink: {
            label: "Privacy policy",
            url: "/privacy",
            isExternal: false,
          },
        },
        {
          __component: "widgets.spotlight-widget",
          eyebrow: "Better together",
          title: "Learn alongside people who are moving forward too",
          summary:
            "Find other learners, share motivation, and turn personal practice into a lively, sustainable learning rhythm.",
          imageUrl: "/landing/study-together.jpg",
          imageAlt: "Friends studying together with a tablet and flashcards",
          orientation: "image-left",
          accent: "green",
        },
        {
          __component: "widgets.rich-text-widget",
          body: richText([
            "Learning works better when progress feels tangible. QuizPet removes the friction between you and the material: open a set, review a few cards, see the result, and continue with your day.",
            "Your sets stay organized, while different study modes let you alternate calm review with an active matching game.",
          ]),
          width: "narrow",
        },
        {
          __component: "widgets.feature-grid-widget",
          eyebrow: "Built for real goals",
          title: "One space for different learning objectives",
          summary:
            "QuizPet works equally well for a short daily review and a large topic you need to master gradually.",
          items: [
            {
              title: "A new language",
              description: "Organize vocabulary by topic and regularly revisit difficult words.",
              icon: "i-lucide-languages",
            },
            {
              title: "An exam or interview",
              description: "Break large material into short questions and precise answers.",
              icon: "i-lucide-badge-check",
            },
            {
              title: "Professional knowledge",
              description: "Keep the terms, rules, and concepts you need at work close at hand.",
              icon: "i-lucide-briefcase-business",
            },
          ],
          variant: "cards",
          tone: "tinted",
        },
        {
          __component: "widgets.callout-widget",
          title: "Ready to turn your first topic into a set?",
          body: paragraph(
            "Sign in with Google, add a few cards, and start your first study session today.",
          ),
          variant: "info",
          icon: "i-lucide-sparkles",
          primaryLink: {
            label: "Start learning",
            url: "/login",
            isExternal: false,
          },
        },
      ],
    },
  },
  {
    routeName: "login",
    path: { uk: "/login", en: "/login" },
    title: { uk: "Вхід", en: "Sign in" },
    parent: "index",
    access: "guestOnly",
    layout: "empty",
    showBreadcrumbs: false,
    blocks: { uk: [functionalBlock("login")], en: [functionalBlock("login")] },
    noIndex: true,
  },
  {
    routeName: "privacy",
    path: { uk: "/privacy", en: "/privacy" },
    title: {
      uk: "Конфіденційність та умови",
      en: "Privacy and terms",
    },
    parent: "index",
    access: "public",
    layout: "empty",
    blocks: {
      uk: [
        {
          __component: "widgets.heading-widget",
          eyebrow: "QuizPet",
          title: "Політика конфіденційності та умови використання",
          summary:
            "Як ми обробляємо дані, навіщо вони потрібні та які правила діють у сервісі.",
          align: "left",
        },
        {
          __component: "widgets.rich-text-widget",
          width: "narrow",
          body: richText([
            "QuizPet — невеликий некомерційний навчальний застосунок. Ми збираємо лише дані, необхідні для входу, профілю та створеного вами контенту.",
            "Вхід відбувається через Google. Ми отримуємо Google ID, email, ім’я, прізвище й аватар, але не зберігаємо пароль або Google access і refresh tokens.",
            "Дані використовуються для автентифікації, показу профілю, збереження наборів карток і навчального прогресу. Ми не продаємо їх третім сторонам.",
            "Акаунт і пов’язані дані можна видалити в налаштуваннях профілю. Сервіс надається як є та може змінюватися.",
          ]),
        },
      ],
      en: [
        {
          __component: "widgets.heading-widget",
          eyebrow: "QuizPet",
          title: "Privacy policy and terms of use",
          summary:
            "How we process data, why it is needed, and which rules apply to the service.",
          align: "left",
        },
        {
          __component: "widgets.rich-text-widget",
          width: "narrow",
          body: richText([
            "QuizPet is a small non-commercial learning app. We collect only the data needed for sign-in, your profile, and the content you create.",
            "You sign in with Google. We receive your Google ID, email, first and last name, and avatar, but we do not store your password or Google access and refresh tokens.",
            "The data is used for authentication, profile display, flashcard sets, and learning progress. We do not sell it to third parties.",
            "You can delete your account and related data in profile settings. The service is provided as is and may change.",
          ]),
        },
      ],
    },
  },
  {
    routeName: "cabinet",
    path: { uk: "/cabinet", en: "/cabinet" },
    title: { uk: "Головна", en: "Home" },
    access: "authenticated",
    layout: "cabinet",
    blocks: { uk: [functionalBlock("home")], en: [functionalBlock("home")] },
  },
  {
    routeName: "folders",
    path: { uk: "/cabinet/folders", en: "/cabinet/folders" },
    title: { uk: "Папки", en: "Folders" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [
        {
          __component: "widgets.callout-widget",
          title: "Розділ папок ще в роботі",
          body: paragraph(
            "Тут з’явиться структура для групування наборів і швидкого перемикання між темами.",
          ),
          variant: "info",
          icon: "i-lucide-folder",
        },
      ],
      en: [
        {
          __component: "widgets.callout-widget",
          title: "Folders are still in progress",
          body: paragraph(
            "This area will organize sets and make it easier to switch between topics.",
          ),
          variant: "info",
          icon: "i-lucide-folder",
        },
      ],
    },
  },
  {
    routeName: "statistic",
    path: { uk: "/cabinet/statistic", en: "/cabinet/statistic" },
    title: { uk: "Статистика", en: "Statistics" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [
        {
          __component: "widgets.callout-widget",
          title: "Розділ статистики готується",
          body: paragraph(
            "Тут з’явиться огляд прогресу, складних карток і динаміки повторень.",
          ),
          variant: "info",
          icon: "i-lucide-bar-chart-3",
        },
      ],
      en: [
        {
          __component: "widgets.callout-widget",
          title: "Statistics are coming soon",
          body: paragraph(
            "This area will show progress, difficult cards, and review trends.",
          ),
          variant: "info",
          icon: "i-lucide-bar-chart-3",
        },
      ],
    },
  },
  {
    routeName: "people",
    path: { uk: "/cabinet/people", en: "/cabinet/people" },
    title: { uk: "Люди", en: "People" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [functionalBlock("people-hero"), functionalBlock("people-grid")],
      en: [functionalBlock("people-hero"), functionalBlock("people-grid")],
    },
  },
  {
    routeName: "pitanyachka",
    path: { uk: "/cabinet/pitanyachka", en: "/cabinet/pitanyachka" },
    title: { uk: "ПІТАНЯЧКА", en: "PITANYACHKA" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [functionalBlock("pitanyachka")],
      en: [functionalBlock("pitanyachka")],
    },
  },
  {
    routeName: "profile",
    path: { uk: "/cabinet/profile", en: "/cabinet/profile" },
    title: { uk: "Профіль", en: "Profile" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: { uk: [functionalBlock("profile")], en: [functionalBlock("profile")] },
  },
  {
    routeName: "sets",
    path: { uk: "/cabinet/sets", en: "/cabinet/sets" },
    title: { uk: "Набори", en: "Sets" },
    parent: "cabinet",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [functionalBlock("sets-list")],
      en: [functionalBlock("sets-list")],
    },
  },
  {
    routeName: "sets-create",
    path: { uk: "/cabinet/sets/create", en: "/cabinet/sets/create" },
    title: { uk: "Новий набір", en: "New set" },
    parent: "sets",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [functionalBlock("create-set")],
      en: [functionalBlock("create-set")],
    },
  },
  {
    routeName: "sets-id-edit",
    path: { uk: "/cabinet/sets/:id/edit", en: "/cabinet/sets/:id/edit" },
    title: { uk: "Редагування набору", en: "Edit set" },
    parent: "sets",
    access: "authenticated",
    layout: "cabinet",
    blocks: {
      uk: [functionalBlock("set-edit-form")],
      en: [functionalBlock("set-edit-form")],
    },
  },
  {
    routeName: "sets-id-learn",
    path: { uk: "/cabinet/sets/:id/learn", en: "/cabinet/sets/:id/learn" },
    title: { uk: "Навчання", en: "Learn" },
    parent: "sets",
    access: "authenticated",
    layout: "cabinet",
    blocks: { uk: [functionalBlock("learn")], en: [functionalBlock("learn")] },
  },
  {
    routeName: "sets-id-match",
    path: { uk: "/cabinet/sets/:id/match", en: "/cabinet/sets/:id/match" },
    title: { uk: "Match", en: "Match" },
    parent: "sets",
    access: "authenticated",
    layout: "cabinet",
    blocks: { uk: [functionalBlock("match")], en: [functionalBlock("match")] },
  },
  {
    routeName: "not-found",
    path: { uk: "/404", en: "/404" },
    title: { uk: "Сторінку не знайдено", en: "Page not found" },
    parent: "index",
    access: "public",
    layout: "default",
    noIndex: true,
    blocks: {
      uk: [
        {
          __component: "widgets.heading-widget",
          eyebrow: "404",
          title: "Сторінку не знайдено",
          summary: "Можливо, адресу було змінено або сторінка більше не існує.",
          align: "center",
        },
        {
          __component: "widgets.callout-widget",
          title: "Поверніться на головну",
          body: paragraph("Там можна продовжити роботу з QuizPet."),
          variant: "warning",
          icon: "i-lucide-map-pin-off",
          primaryLink: { label: "На головну", url: "/", isExternal: false },
        },
      ],
      en: [
        {
          __component: "widgets.heading-widget",
          eyebrow: "404",
          title: "Page not found",
          summary: "The address may have changed or the page no longer exists.",
          align: "center",
        },
        {
          __component: "widgets.callout-widget",
          title: "Return home",
          body: paragraph("You can continue using QuizPet from there."),
          variant: "warning",
          icon: "i-lucide-map-pin-off",
          primaryLink: { label: "Home", url: "/", isExternal: false },
        },
      ],
    },
  },
];

const translations: Record<string, Record<TLocale, string>> = {
  "common.language.uk": { uk: "Українська", en: "Ukrainian" },
  "common.language.en": { uk: "Англійська", en: "English" },
  "common.menu": { uk: "Меню", en: "Menu" },
  "common.breadcrumbs": { uk: "Навігаційний шлях", en: "Breadcrumbs" },
  "common.home": { uk: "Головна", en: "Home" },
  "common.folders": { uk: "Папки", en: "Folders" },
  "common.cards": { uk: "Картки", en: "Cards" },
  "common.statistics": { uk: "Статистика", en: "Statistics" },
  "common.people": { uk: "Люди", en: "People" },
  "common.profile": { uk: "Профіль", en: "Profile" },
  "common.logout": { uk: "Вийти", en: "Sign out" },
  "common.newSet": { uk: "Новий набір", en: "New set" },
  "common.createStudyCards": {
    uk: "Створити картки для навчання",
    en: "Create cards to study",
  },
  "common.editProfile": { uk: "Редагувати профіль", en: "Edit profile" },
  "common.openSidebar": {
    uk: "Відкрити або закрити бокову панель",
    en: "Open or close the sidebar",
  },
  "common.studySpace": { uk: "Навчальний простір", en: "Learning space" },
  "common.studyMode": { uk: "Режим навчання", en: "Study mode" },
  "common.flashcardLearning": { uk: "Навчання картками", en: "Flashcard learning" },
  "common.smallSteps": {
    uk: "Маленькі кроки, сильна пам’ять.",
    en: "Small steps, strong memory.",
  },
  "common.projectLinks": { uk: "Посилання проєкту", en: "Project links" },
  "common.privacy": {
    uk: "Конфіденційність та умови",
    en: "Privacy and terms",
  },
  "landing.navigation": { uk: "Навігація лендингу", en: "Landing navigation" },
  "landing.features": { uk: "Можливості", en: "Features" },
  "landing.howItWorks": { uk: "Як це працює", en: "How it works" },
  "landing.start": { uk: "Почати безкоштовно", en: "Start for free" },
  "landing.openCabinet": { uk: "Відкрити кабінет", en: "Open dashboard" },
  "landing.ctaShort": { uk: "Почати", en: "Start" },
  "home.eyebrow": { uk: "Сьогодні у QuizPet", en: "Today in QuizPet" },
  "home.title.named": {
    uk: "{name}, готові до короткого навчального спринту?",
    en: "{name}, ready for a short learning sprint?",
  },
  "home.title.default": {
    uk: "Готові до короткого навчального спринту?",
    en: "Ready for a short learning sprint?",
  },
  "home.summary": {
    uk: "Оберіть набір і проведіть кілька хвилин у фокусі. Прогрес складається з коротких, регулярних повторень.",
    en: "Choose a set and spend a few focused minutes. Progress comes from short, regular reviews.",
  },
  "home.startLearning": { uk: "Почати навчання", en: "Start learning" },
  "home.quickAccess": { uk: "Швидкий доступ", en: "Quick access" },
  "home.keepPace": { uk: "Продовжуйте у своєму темпі", en: "Keep your own pace" },
  "home.everythingNearby": {
    uk: "Усе необхідне для навчання зібране поруч.",
    en: "Everything you need to learn is close at hand.",
  },
  "home.metric.people": { uk: "Люди", en: "People" },
  "home.metric.sets": { uk: "Набори", en: "Sets" },
  "home.metric.topics": { uk: "Теми", en: "Topics" },
  "home.link.cards.title": { uk: "Картки", en: "Cards" },
  "home.link.cards.description": {
    uk: "Ваші набори, повторення та швидкий старт навчання.",
    en: "Your sets, reviews, and a quick start to learning.",
  },
  "home.link.profile.title": { uk: "Профіль", en: "Profile" },
  "home.link.profile.description": {
    uk: "Ім’я, аватар та особисті дані облікового запису.",
    en: "Your name, avatar, and account details.",
  },
  "home.link.people.title": { uk: "Спільнота", en: "Community" },
  "home.link.people.description": {
    uk: "Учасники платформи та майбутні навчальні зв’язки.",
    en: "Platform members and future learning connections.",
  },
  "people.hero.eyebrow": { uk: "Спільнота", en: "Community" },
  "people.hero.title": {
    uk: "Навчатися легше разом",
    en: "Learning is easier together",
  },
  "people.hero.description": {
    uk: "Знайомтеся з учасниками QuizPet і стежте, як зростає навчальна спільнота.",
    en: "Meet QuizPet members and watch the learning community grow.",
  },
  "people.grid.eyebrow": { uk: "Користувачі", en: "Users" },
  "people.grid.title": { uk: "Усі учасники", en: "All members" },
  "people.grid.count": {
    uk: "{count} користувач | {count} користувачі | {count} користувачів",
    en: "{count} user | {count} users",
  },
  "people.grid.error": {
    uk: "Не вдалося завантажити користувачів",
    en: "Could not load users",
  },
  "people.grid.empty": {
    uk: "Користувачів поки немає",
    en: "There are no users yet",
  },
  "login.eyebrow": { uk: "Вхід", en: "Sign in" },
  "login.title": { uk: "Продовжити в QuizPet", en: "Continue to QuizPet" },
  "login.description": {
    uk: "Авторизуйся через Google, щоб зберегти прогрес, результати та персональні добірки квізів на будь-якому пристрої.",
    en: "Sign in with Google to keep your progress, results, and personal quiz collections on every device.",
  },
  "login.google": { uk: "Продовжити з Google", en: "Continue with Google" },
  "login.secure": {
    uk: "Без паролів. Безпечний вхід через Google.",
    en: "No passwords. Secure sign-in with Google.",
  },
  "login.agreement.prefix": {
    uk: "Реєструючись або продовжуючи через Google, ви підтверджуєте, що ознайомилися з",
    en: "By registering or continuing with Google, you confirm that you have read the",
  },
  "login.agreement.link": {
    uk: "Політикою конфіденційності та Умовами використання",
    en: "Privacy Policy and Terms of Use",
  },
  "login.openSource": {
    uk: "Проєкт з відкритим кодом. Повідомити про проблему або зв'язатися з автором:",
    en: "Open-source project. Report an issue or contact the author:",
  },
  "login.githubAria": {
    uk: "GitHub проєкту QuizPet (відкривається в новій вкладці)",
    en: "QuizPet project on GitHub (opens in a new tab)",
  },
  "login.telegramAria": {
    uk: "Telegram автора (відкривається в новій вкладці)",
    en: "Author's Telegram (opens in a new tab)",
  },
  "login.metric.quizzes": { uk: "готових квізів", en: "ready-made quizzes" },
  "login.metric.live": { uk: "рейтинги та дуелі", en: "ratings and duels" },
  "login.metric.sync": {
    uk: "прогрес між пристроями",
    en: "progress across devices",
  },
  "login.showcase.title": {
    uk: "Вікторини, які хочеться проходити до кінця",
    en: "Quizzes you will want to finish",
  },
  "login.showcase.description": {
    uk: "Обирай улюблені теми, відповідай швидше за інших і повертайся по нову порцію запитань.",
    en: "Choose favorite topics, answer faster than others, and come back for another round of questions.",
  },
  "pitanyachka.hero.eyebrow": { uk: "Гра для компанії", en: "Party game" },
  "pitanyachka.hero.title": { uk: "ПИТАНЯЧКА", en: "PITANYACHKA" },
  "pitanyachka.hero.description": {
    uk: "Усі, хто зайшов на цю сторінку, автоматично в грі. Будь-хто генерує питання, читає його вголос і передає хід далі.",
    en: "Everyone who opens this page joins the game automatically. Any player can generate a question, read it aloud, and pass the turn on.",
  },
  "pitanyachka.reading.title": {
    uk: "{name} читає своє питання",
    en: "{name} is reading their question",
  },
  "pitanyachka.reading.description": {
    uk: "Слухайте уважно та чекайте, поки хід передадуть далі.",
    en: "Listen carefully and wait for the turn to be passed on.",
  },
  "pitanyachka.finished.title": {
    uk: "Питання закінчились",
    en: "No questions left",
  },
  "pitanyachka.finished.description": {
    uk: "Усі питання вже прозвучали. Натисніть «Почати заново», щоб зіграти зі свіжою колодою.",
    en: "Every question has been used. Select Restart to play with a fresh deck.",
  },
  "pitanyachka.free.title": { uk: "Хід вільний", en: "The turn is open" },
  "pitanyachka.free.description": {
    uk: "Будь-хто з гравців може згенерувати наступне питання.",
    en: "Any player can generate the next question.",
  },
  "pitanyachka.generate": { uk: "Згенерувати питання", en: "Generate question" },
  "pitanyachka.player": { uk: "Гравець", en: "Player" },
  "pitanyachka.category.title": { uk: "Оберіть категорію", en: "Choose a category" },
  "pitanyachka.category.description": {
    uk: "Питання під час гри будуть лише з обраної категорії. «Всі категорії» — грати з усіма питаннями одразу.",
    en: "Questions will come only from the selected category. Choose All categories to play with the full deck.",
  },
  "pitanyachka.category.all": { uk: "Всі категорії", en: "All categories" },
  "pitanyachka.start": { uk: "Почати гру", en: "Start game" },
  "pitanyachka.connected": { uk: "На звʼязку", en: "Connected" },
  "pitanyachka.connecting": { uk: "Підключення…", en: "Connecting…" },
  "pitanyachka.restart": { uk: "Почати заново", en: "Restart" },
  "pitanyachka.pass": { uk: "Передати хід", en: "Pass the turn" },
  "common.cancel": { uk: "Скасувати", en: "Cancel" },
  "profile.loadError.title": {
    uk: "Не вдалося завантажити профіль",
    en: "Could not load profile",
  },
  "profile.loadError.description": {
    uk: "Спробуйте оновити дані профілю ще раз.",
    en: "Try loading your profile again.",
  },
  "profile.eyebrow": { uk: "Профіль", en: "Profile" },
  "profile.title": { uk: "Ваш профіль", en: "Your profile" },
  "profile.description": {
    uk: "Оновіть ім’я та аватар, які бачать інші учасники QuizPet.",
    en: "Update the name and avatar other QuizPet members can see.",
  },
  "profile.firstName.label": { uk: "Ім'я", en: "First name" },
  "profile.firstName.description": {
    uk: "Використовується в профілі та списках користувачів.",
    en: "Used in your profile and user lists.",
  },
  "profile.firstName.placeholder": { uk: "Наприклад, Петро", en: "For example, Peter" },
  "profile.lastName.label": { uk: "Прізвище", en: "Last name" },
  "profile.lastName.description": {
    uk: "Допомагає показувати повне ім’я в інтерфейсі.",
    en: "Used to display your full name in the interface.",
  },
  "profile.lastName.placeholder": { uk: "Наприклад, Мельник", en: "For example, Miller" },
  "profile.email.description": {
    uk: "Поле доступне лише для перегляду, бо авторизація йде через Google.",
    en: "This field is read-only because sign-in is handled by Google.",
  },
  "profile.avatar.label": { uk: "Аватар", en: "Avatar" },
  "profile.avatar.description": {
    uk: "Оберіть квадратне або близьке до квадратного зображення для кращого вигляду.",
    en: "Choose a square or nearly square image for the best result.",
  },
  "profile.save": { uk: "Зберегти профіль", en: "Save profile" },
  "profile.delete.sectionTitle": { uk: "Видалення акаунта", en: "Delete account" },
  "profile.delete.sectionDescription": {
    uk: "Ця дія незворотна. Буде видалено ваш акаунт, аватар і всі створені вами набори карток.",
    en: "This action cannot be undone. Your account, avatar, and every set you created will be deleted.",
  },
  "profile.delete.action": { uk: "Видалити акаунт", en: "Delete account" },
  "profile.delete.modalTitle": { uk: "Видалити акаунт?", en: "Delete account?" },
  "profile.delete.modalDescription": {
    uk: "Відновити дані буде неможливо.",
    en: "The data cannot be restored.",
  },
  "profile.delete.confirmPrompt": {
    uk: "Для підтвердження введіть свій email",
    en: "Enter your email to confirm",
  },
  "profile.delete.confirmLabel": { uk: "Підтвердження email", en: "Confirm email" },
  "profile.delete.confirmPlaceholder": { uk: "Ваш email", en: "Your email" },
  "profile.delete.forever": { uk: "Видалити назавжди", en: "Delete permanently" },
  "profile.validation.firstName": { uk: "Вкажіть ім'я", en: "Enter your first name" },
  "profile.validation.lastName": { uk: "Вкажіть прізвище", en: "Enter your last name" },
  "profile.toast.deleted": { uk: "Акаунт видалено", en: "Account deleted" },
  "profile.toast.deleteError": {
    uk: "Не вдалося видалити акаунт",
    en: "Could not delete account",
  },
  "profile.toast.updated": { uk: "Профіль оновлено", en: "Profile updated" },
  "profile.toast.updateError": {
    uk: "Не вдалося зберегти профіль",
    en: "Could not save profile",
  },
  "sets.hero.eyebrow": { uk: "Бібліотека карток", en: "Flashcard library" },
  "sets.hero.title": {
    uk: "Набори для швидкого повторення",
    en: "Sets for quick review",
  },
  "sets.hero.description": {
    uk: "Перемикайтеся між власними наборами та всією доступною бібліотекою, відкривайте навчання або створюйте нову тему.",
    en: "Switch between your sets and the full library, start learning, or create a new topic.",
  },
  "sets.create": { uk: "Створити набір", en: "Create set" },
  "sets.card.eyebrow": { uk: "Набір карток", en: "Flashcard set" },
  "sets.card.noDescription": {
    uk: "Опис ще не доданий, але набір уже готовий до наповнення.",
    en: "No description yet, but the set is ready for cards.",
  },
  "sets.card.noTopics": { uk: "Без тематики", en: "No topics" },
  "sets.card.cards": { uk: "Карток", en: "Cards" },
  "sets.card.topics": { uk: "Тем", en: "Topics" },
  "sets.card.author": { uk: "Створив", en: "Author" },
  "sets.card.learn": { uk: "Вчитись", en: "Learn" },
  "sets.card.edit": { uk: "Редагувати набір", en: "Edit set" },
  "sets.card.delete": { uk: "Видалити набір", en: "Delete set" },
  "sets.grid.eyebrow": { uk: "Набори", en: "Sets" },
  "sets.grid.errorTitle": {
    uk: "Не вдалося завантажити набори",
    en: "Could not load sets",
  },
  "sets.grid.errorDescription": {
    uk: "Спробуйте ще раз. Якщо проблема повторюється, варто перевірити доступність бекенду.",
    en: "Try again. If the problem continues, check whether the backend is available.",
  },
  "sets.grid.createFirst": { uk: "Створити перший набір", en: "Create the first set" },
  "sets.scope.mine": { uk: "Мої набори", en: "My sets" },
  "sets.scope.all": { uk: "Усі набори", en: "All sets" },
  "sets.grid.mineTitle": { uk: "Ваша колекція карток", en: "Your flashcard collection" },
  "sets.grid.allTitle": { uk: "Усі доступні картки", en: "All available cards" },
  "sets.grid.filteredEmptyTitle": { uk: "Нічого не знайдено", en: "Nothing found" },
  "sets.grid.mineEmptyTitle": {
    uk: "У вас ще немає наборів",
    en: "You do not have any sets yet",
  },
  "sets.grid.allEmptyTitle": {
    uk: "Поки що немає доступних наборів",
    en: "There are no available sets yet",
  },
  "sets.grid.filteredEmptyDescription": {
    uk: "Спробуйте змінити умови пошуку або очистити активні фільтри.",
    en: "Change the search criteria or clear the active filters.",
  },
  "sets.grid.mineEmptyDescription": {
    uk: "Створіть перший набір: додайте тему, короткий опис і кілька карток.",
    en: "Create your first set with a topic, a short description, and a few cards.",
  },
  "sets.grid.allEmptyDescription": {
    uk: "Створіть перший набір, щоб він з’явився у спільній бібліотеці.",
    en: "Create the first set so it appears in the shared library.",
  },
  "sets.filters.clear": { uk: "Очистити фільтри", en: "Clear filters" },
  "sets.filters.title": { uk: "Фільтри", en: "Filters" },
  "sets.filters.description": {
    uk: "Звузьте бібліотеку за потрібними параметрами.",
    en: "Narrow the library using the options you need.",
  },
  "sets.filters.clearShort": { uk: "Очистити", en: "Clear" },
  "sets.filters.name": { uk: "Назва набору", en: "Set name" },
  "sets.filters.namePlaceholder": { uk: "Знайти набір", en: "Find a set" },
  "sets.filters.topic": { uk: "Тематика", en: "Topic" },
  "sets.filters.allTopics": { uk: "Усі тематики", en: "All topics" },
  "sets.filters.topicSearch": { uk: "Знайти тематику", en: "Find a topic" },
  "sets.filters.englishLevel": { uk: "Рівень англійської", en: "English level" },
  "sets.filters.allLevels": { uk: "Усі рівні", en: "All levels" },
  "sets.filters.levelSearch": { uk: "Знайти рівень", en: "Find a level" },
  "sets.filters.author": { uk: "Автор", en: "Author" },
  "sets.filters.allAuthors": { uk: "Усі автори", en: "All authors" },
  "sets.filters.authorSearch": { uk: "Знайти автора", en: "Find an author" },
  "sets.filters.error": {
    uk: "Не вдалося завантажити параметри фільтрів.",
    en: "Could not load filter options.",
  },
  "common.retry": { uk: "Повторити", en: "Retry" },
  "sets.stats.mine": { uk: "Ваших наборів", en: "Your sets" },
  "sets.stats.all": { uk: "Усього наборів", en: "Total sets" },
  "sets.stats.topics": { uk: "Тем на сторінці", en: "Topics on this page" },
  "sets.stats.described": { uk: "З описом на сторінці", en: "With descriptions" },
  "sets.summary.filteredEmpty": {
    uk: "За вибраними фільтрами наборів не знайдено.",
    en: "No sets match the selected filters.",
  },
  "sets.summary.mineEmpty": {
    uk: "Створіть перший набір і почніть збирати власну навчальну полицю.",
    en: "Create your first set and start building your learning shelf.",
  },
  "sets.summary.allEmpty": {
    uk: "У бібліотеці поки немає доступних наборів.",
    en: "There are no available sets in the library yet.",
  },
  "sets.summary.mine": {
    uk: "{count} ваш набір уже готовий для повторення та подальшого наповнення. | {count} ваші набори у навчальній колекції. | {count} ваших наборів у навчальній колекції.",
    en: "{count} set in your learning collection. | {count} sets in your learning collection.",
  },
  "sets.summary.all": {
    uk: "{count} набір уже доступний для повторення. | {count} набори доступні в бібліотеці для швидкого повторення. | {count} наборів доступно в бібліотеці для швидкого повторення.",
    en: "{count} set is available for review. | {count} sets are available for review.",
  },
  "sets.deleteConfirm": {
    uk: "Видалити набір «{name}»? Цю дію не можна скасувати.",
    en: "Delete the set “{name}”? This action cannot be undone.",
  },
  "common.save": { uk: "Зберегти", en: "Save" },
  "sets.form.changesReady": { uk: "Зміни готові до збереження", en: "Changes are ready to save" },
  "sets.form.draftSaved": { uk: "Чернетка зберігається", en: "Draft is saved locally" },
  "sets.form.name.label": { uk: "Назва набору", en: "Set name" },
  "sets.form.name.description": { uk: "Коротка назва, яку легко впізнати.", en: "A short, recognizable name." },
  "sets.form.name.placeholder": { uk: "Наприклад, Basic Biology", en: "For example, Basic Biology" },
  "sets.form.level.label": { uk: "Рівень англійської", en: "English level" },
  "sets.form.level.description": { uk: "За потреби оберіть рівень складності набору.", en: "Optionally choose the difficulty level of the set." },
  "sets.form.level.error": { uk: "Не вдалося завантажити рівні", en: "Could not load levels" },
  "sets.form.level.clear": { uk: "Не вказувати рівень", en: "Do not specify a level" },
  "sets.form.topics.label": { uk: "Тематика", en: "Topics" },
  "sets.form.topics.description": { uk: "Оберіть щонайменше одну категорію.", en: "Choose at least one category." },
  "sets.form.topics.error": { uk: "Не вдалося завантажити тематики", en: "Could not load topics" },
  "sets.form.description.label": { uk: "Опис", en: "Description" },
  "sets.form.description.description": { uk: "Що саме допоможе вивчити цей набір.", en: "What this set will help you learn." },
  "sets.form.description.placeholder": { uk: "Коротко опишіть тему або навчальну мету", en: "Briefly describe the topic or learning goal" },
  "sets.form.tip": { uk: "Найкраще запам’ятовуються короткі картки: одна думка, одна відповідь і лише необхідний контекст.", en: "Short cards work best: one idea, one answer, and only the context you need." },
  "sets.form.cards.eyebrow": { uk: "Наповнення", en: "Content" },
  "sets.form.cards.title": { uk: "Картки набору", en: "Set cards" },
  "sets.form.cards.count": { uk: "{count} картка | {count} картки | {count} карток", en: "{count} card | {count} cards" },
  "sets.form.cards.add": { uk: "Додати картку", en: "Add card" },
  "sets.form.editEyebrow": { uk: "Редагування набору", en: "Edit set" },
  "sets.form.newEyebrow": { uk: "Новий набір", en: "New set" },
  "sets.form.editTitle": { uk: "Оновити набір", en: "Update set" },
  "sets.form.newTitle": { uk: "Створити набір карток", en: "Create a flashcard set" },
  "sets.form.editDescription": { uk: "Змініть основні дані або відредагуйте окремі картки.", en: "Update the basic details or edit individual cards." },
  "sets.form.newDescription": { uk: "Додайте тему, короткий опис і щонайменше дві картки.", en: "Add a topic, a short description, and at least two cards." },
  "sets.cardForm.number": { uk: "Картка {number}", en: "Card {number}" },
  "sets.cardForm.subtitle": { uk: "Термін і правильна відповідь", en: "Term and correct answer" },
  "sets.cardForm.moveUp": { uk: "Перемістити картку вище", en: "Move card up" },
  "sets.cardForm.moveDown": { uk: "Перемістити картку нижче", en: "Move card down" },
  "sets.cardForm.delete": { uk: "Видалити картку", en: "Delete card" },
  "sets.cardForm.term.label": { uk: "Термін", en: "Term" },
  "sets.cardForm.term.description": { uk: "Слово, поняття або питання.", en: "A word, concept, or question." },
  "sets.cardForm.term.placeholder": { uk: "Наприклад, Photosynthesis", en: "For example, Photosynthesis" },
  "sets.cardForm.hint.label": { uk: "Підказка", en: "Hint" },
  "sets.cardForm.hint.description": { uk: "Коротке уточнення до терміна.", en: "A short clarification for the term." },
  "sets.cardForm.hint.placeholder": { uk: "Необов’язковий контекст", en: "Optional context" },
  "sets.cardForm.definition.label": { uk: "Визначення", en: "Definition" },
  "sets.cardForm.definition.description": { uk: "Пояснення, переклад або правильна відповідь.", en: "An explanation, translation, or correct answer." },
  "sets.cardForm.definition.placeholder": { uk: "Дайте коротку й точну відповідь", en: "Give a short, precise answer" },
  "sets.cardForm.appearance": { uk: "Зображення та оформлення", en: "Images and appearance" },
  "sets.cardForm.termImage.label": { uk: "Зображення терміна", en: "Term image" },
  "sets.cardForm.termImage.description": { uk: "Необов’язкова візуальна підказка.", en: "An optional visual hint." },
  "sets.cardForm.definitionImage.label": { uk: "Зображення відповіді", en: "Answer image" },
  "sets.cardForm.definitionImage.description": { uk: "Окрема ілюстрація для визначення.", en: "A separate illustration for the definition." },
  "sets.cardForm.textColor.label": { uk: "Колір тексту", en: "Text color" },
  "sets.cardForm.textColor.description": { uk: "Залиште порожнім для кольору теми.", en: "Leave empty to use the theme color." },
  "sets.cardForm.backgroundColor.label": { uk: "Колір фону", en: "Background color" },
  "sets.cardForm.backgroundColor.description": { uk: "Залиште порожнім для стандартної поверхні.", en: "Leave empty to use the default surface." },
  "sets.edit.loadError.title": { uk: "Не вдалося завантажити набір", en: "Could not load set" },
  "sets.edit.loadError.description": { uk: "Спробуйте повторно відкрити редактор набору.", en: "Try opening the set editor again." },
  "sets.csv.title": { uk: "Робота з CSV", en: "CSV tools" },
  "sets.csv.columnsPrefix": { uk: "Колонки:", en: "Columns:" },
  "sets.csv.and": { uk: "і", en: "and" },
  "sets.csv.replaces": { uk: "Імпорт замінює поточні картки.", en: "Import replaces the current cards." },
  "sets.csv.export": { uk: "Експорт", en: "Export" },
  "sets.csv.import": { uk: "Імпорт", en: "Import" },
  "sets.csv.error.empty": { uk: "CSV не містить жодного рядка з term, termDescription і definition.", en: "The CSV does not contain any rows with term, termDescription, and definition." },
  "sets.csv.toast.imported": { uk: "CSV імпортовано", en: "CSV imported" },
  "sets.csv.toast.count": { uk: "Завантажено {count} картку. | Завантажено {count} картки. | Завантажено {count} карток.", en: "Imported {count} card. | Imported {count} cards." },
  "sets.csv.toast.error": { uk: "Не вдалося імпортувати CSV", en: "Could not import CSV" },
  "sets.csv.error.format": { uk: "Перевірте формат файлу.", en: "Check the file format." },
  "sets.csv.error.headers": { uk: "CSV має містити заголовки term, termDescription і definition.", en: "The CSV must include term, termDescription, and definition headers." },
  "sets.csv.error.quotes": { uk: "CSV містить незакриті лапки.", en: "The CSV contains an unclosed quote." },
  "sets.toast.updated": { uk: "Набір оновлено", en: "Set updated" },
  "sets.toast.created": { uk: "Набір створено", en: "Set created" },
  "sets.toast.saveError": { uk: "Не вдалося зберегти набір", en: "Could not save set" },
  "sets.toast.validationError": { uk: "Перевірте введені дані та спробуйте ще раз.", en: "Check the entered data and try again." },
  "sets.toast.retryError": { uk: "Спробуйте повторити дію.", en: "Try the action again." },
  "common.error": { uk: "Помилка", en: "Error" },
  "common.dataLoadError": { uk: "Не вдалося завантажити дані", en: "Could not load data" },
  "common.retryAgain": { uk: "Спробувати знову", en: "Try again" },
  "common.color.choose": { uk: "Оберіть колір", en: "Choose a color" },
  "common.color.select": { uk: "Обрати колір {color}", en: "Choose color {color}" },
  "common.apply": { uk: "Застосувати", en: "Apply" },
  "common.clear": { uk: "Очистити", en: "Clear" },
  "common.change": { uk: "Змінити", en: "Change" },
  "common.refresh": { uk: "Оновити", en: "Refresh" },
  "common.select": { uk: "Обрати", en: "Select" },
  "filePicker.open": { uk: "Натисніть, щоб вибрати або завантажити зображення", en: "Select or upload an image" },
  "filePicker.notSelected": { uk: "Зображення не вибране", en: "No image selected" },
  "filePicker.title": { uk: "Вибір зображення", en: "Choose an image" },
  "filePicker.description": { uk: "Тут можна завантажити новий файл або вибрати вже існуюче зображення.", en: "Upload a new file or choose an existing image." },
  "filePicker.upload.title": { uk: "Завантаження", en: "Upload" },
  "filePicker.upload.description": { uk: "Після вибору файл одразу відправляється на сервер.", en: "The selected file is uploaded immediately." },
  "filePicker.upload.progress": { uk: "Завантаження...", en: "Uploading..." },
  "filePicker.upload.label": { uk: "Натисніть або перетягніть зображення", en: "Select or drag an image" },
  "filePicker.library.title": { uk: "Бібліотека", en: "Library" },
  "filePicker.library.description": { uk: "Клік по картці вибирає файл. Видалення прибирає його з бібліотеки.", en: "Select a card to use the file. Deleting removes it from the library." },
  "filePicker.library.emptyTitle": { uk: "Бібліотека порожня", en: "The library is empty" },
  "filePicker.library.emptyDescription": { uk: "Завантажте перше зображення, і воно одразу з’явиться тут.", en: "Upload the first image and it will appear here." },
  "filePicker.selected": { uk: "Вибрано", en: "Selected" },
  "filePicker.preview.empty": { uk: "Попередній перегляд з’явиться тут", en: "The preview will appear here" },
  "filePicker.preview.active": { uk: "Активний файл", en: "Active file" },
  "filePicker.preview.noFile": { uk: "Файл ще не вибраний", en: "No file selected yet" },
  "filePicker.preview.pathHint": { uk: "Після вибору тут з’явиться шлях до файлу.", en: "The file path will appear here after selection." },
  "filePicker.preview.usage": { uk: "Це зображення буде використане для поточного поля форми.", en: "This image will be used for the current form field." },
  "filePicker.error.list": { uk: "Не вдалося завантажити список зображень.", en: "Could not load the image list." },
  "filePicker.error.upload": { uk: "Не вдалося завантажити файл на сервер.", en: "Could not upload the file." },
  "filePicker.deleteConfirm": { uk: "Видалити файл «{name}» з бібліотеки?", en: "Delete “{name}” from the library?" },
  "filePicker.error.delete": { uk: "Не вдалося видалити файл.", en: "Could not delete the file." },
  "learn.loadError.title": { uk: "Не вдалося завантажити набір", en: "Could not load set" },
  "learn.loadError.description": { uk: "Спробуйте оновити сторінку або повторно звернутися до сервера.", en: "Refresh the page or try the server request again." },
  "learn.empty": { uk: "У наборі поки немає карток", en: "This set does not have any cards yet" },
  "learn.missed": { uk: "Не знаю", en: "Not yet" },
  "learn.known": { uk: "Знаю", en: "I know it" },
  "learn.knownNext": { uk: "Знаю, далі", en: "I know it, next" },
  "learn.progress.empty": { uk: "Немає карток для проходження", en: "There are no cards to study" },
  "learn.progress.step": { uk: "Крок {current} з {total}", en: "Step {current} of {total}" },
  "learn.progress.learned": { uk: "Засвоєно", en: "Learned" },
  "learn.progress.repeats": { uk: "Повтори", en: "Repeats" },
  "learn.progress.session": { uk: "Сеанс", en: "Session" },
  "learn.speech.stop": { uk: "Зупинити озвучення", en: "Stop speaking" },
  "learn.speech.start": { uk: "Озвучити картку", en: "Read card aloud" },
  "learn.editCard": { uk: "Редагувати картку", en: "Edit card" },
  "learn.fullscreen.exit": { uk: "Вийти з повного екрана", en: "Exit full screen" },
  "learn.fullscreen.enter": { uk: "Повний екран", en: "Full screen" },
  "learn.showTerm": { uk: "Показати термін", en: "Show term" },
  "learn.showAnswer": { uk: "Показати відповідь", en: "Show answer" },
  "learn.term": { uk: "Термін", en: "Term" },
  "learn.answer": { uk: "Відповідь", en: "Answer" },
  "learn.hints.controlsAria": { uk: "Підказки та керування з клавіатури", en: "Hints and keyboard controls" },
  "learn.hints.flip": { uk: "Натисніть картку, щоб побачити іншу сторону", en: "Select the card to see the other side" },
  "learn.hints.space": { uk: "Пробіл", en: "Space" },
  "learn.hints.flipCard": { uk: "Перевернути картку", en: "Flip card" },
  "learn.hints.swipe": { uk: "Свайп вправо — не знаю, вліво — знаю", en: "Swipe right for not yet, left for known" },
  "learn.hints.corner": { uk: "Кут картки", en: "Card corner" },
  "learn.hints.answerAria": { uk: "Підказка: перша літера відповіді", en: "Hint: first letter of the answer" },
  "learn.hints.title": { uk: "Підказка", en: "Hint" },
  "learn.hints.description": { uk: "Перша літера відповіді — решту згадайте самі.", en: "The first letter is shown; recall the rest yourself." },
  "learn.results.eyebrow": { uk: "Результати", en: "Results" },
  "learn.results.restart": { uk: "Пройти ще раз", en: "Study again" },
  "learn.results.retryMistakes": { uk: "Повторити лише складні", en: "Repeat difficult cards" },
  "learn.results.reviewEyebrow": { uk: "Розбір карток", en: "Card review" },
  "learn.results.reviewTitle": { uk: "Де було легко, а де варто ще пройтись", en: "What was easy and what needs another pass" },
  "learn.results.cardCount": { uk: "{count} картка у підсумку | {count} картки у підсумку | {count} карток у підсумку", en: "{count} card in the summary | {count} cards in the summary" },
  "learn.results.mistakes": { uk: "Було помилок: {count}", en: "Mistakes: {count}" },
  "learn.results.noMistakes": { uk: "Без помилок", en: "No mistakes" },
  "learn.results.attempts": { uk: "Спроб", en: "Attempts" },
  "learn.results.time": { uk: "Час", en: "Time" },
  "learn.results.average": { uk: "Середнє", en: "Average" },
  "learn.results.headingEmpty": { uk: "Підсумок з'явиться після проходження", en: "Your summary will appear after the session" },
  "learn.results.headingPerfect": { uk: "Ідеальний прохід без помилок", en: "A perfect session with no mistakes" },
  "learn.results.headingReview": { uk: "Сеанс завершено, є що закріпити", en: "Session complete, with a few things to reinforce" },
  "learn.results.summaryEmpty": { uk: "Додайте картки в набір і поверніться до режиму навчання.", en: "Add cards to the set and return to study mode." },
  "learn.results.summaryPerfect": { uk: "Усі картки були закриті без промахів. Можна або піти далі, або пройти набір ще раз для закріплення темпу.", en: "You completed every card without a miss. Move on or study the set again to reinforce your pace." },
  "learn.results.summaryReview": { uk: "{count} картка потребувала повторення. Нижче видно затримки та кількість спроб. | {count} картки потребували повторення. Нижче видно затримки та кількість спроб. | {count} карток потребували повторення. Нижче видно затримки та кількість спроб.", en: "{count} card needed repetition. The details below show delays and attempts. | {count} cards needed repetition. The details below show delays and attempts." },
  "learn.results.accuracy": { uk: "Точність", en: "Accuracy" },
  "learn.results.firstTry": { uk: "З першого разу", en: "First try" },
  "learn.results.totalTime": { uk: "Загальний час", en: "Total time" },
  "learn.results.averageTime": { uk: "Середній час", en: "Average time" },
  "common.profileLoading": { uk: "Завантаження профілю", en: "Loading profile" },
  "sets.form.loading": { uk: "Завантаження редактора набору", en: "Loading set editor" },
  "study.modes": { uk: "Режими навчання", en: "Study modes" },
  "study.backToSets": { uk: "Назад до наборів", en: "Back to sets" },
  "study.learn": { uk: "Навчання", en: "Learn" },
  "study.match": { uk: "Match", en: "Match" },
  "match.round": { uk: "Раунд {current} з {total}", en: "Round {current} of {total}" },
  "match.pairsProgress": { uk: "{matched} / {total} пар", en: "{matched} / {total} pairs" },
  "match.nextRound": { uk: "Наступний раунд", en: "Next round" },
  "match.words": { uk: "Слова", en: "Words" },
  "match.definitions": { uk: "Визначення", en: "Definitions" },
  "match.feedback.error": { uk: "Не збігається. Спробуйте іншу пару.", en: "Not a match. Try another pair." },
  "match.feedback.success": { uk: "Правильна пара!", en: "Correct match!" },
  "match.feedback.roundComplete": { uk: "Усі пари цього раунду знайдені.", en: "All pairs in this round matched." },
  "match.feedback.choosePair": { uk: "Тепер оберіть відповідник в іншій колонці.", en: "Now choose the matching item in the other column." },
  "match.feedback.start": { uk: "Оберіть слово або визначення, щоб почати.", en: "Choose a word or definition to begin." },
  "match.tileMatched": { uk: "{text}: знайдено пару", en: "{text}: matched" },
  "match.results.title": { uk: "Усі пари знайдено!", en: "Every pair matched!" },
  "match.results.playAgain": { uk: "Зіграти ще раз", en: "Play again" },
  "match.results.continueLearn": { uk: "Продовжити в Learn", en: "Continue with Learn" },
  "match.metrics.matched": { uk: "Знайдено", en: "Pairs matched" },
  "match.metrics.time": { uk: "Час", en: "Time" },
  "match.metrics.mistakes": { uk: "Помилки", en: "Mistakes" },
  "match.metrics.accuracy": { uk: "Точність", en: "Accuracy" },
  "match.loadError.title": { uk: "Не вдалося завантажити набір", en: "Unable to load this set" },
  "match.loadError.description": { uk: "Спробуйте ще раз.", en: "Please try again." },
  "match.loading": { uk: "Завантаження Match", en: "Loading matching session" },
  "match.empty.title": { uk: "Поки немає слів для Match", en: "No words to match yet" },
  "match.empty.description": { uk: "Додайте картки зі словом і визначенням, щоб почати.", en: "Add cards with both a word and a definition to start matching." },
  "match.empty.action": { uk: "Додати картки", en: "Add cards" },
  "match.eyebrow": { uk: "Пошук пар", en: "Word match" },
  "match.intro": { uk: "Знайдіть визначення для кожного слова. Пройдіть {count} пар раундами до {size}. Таймер запуститься на початку гри.", en: "Match each word with its definition. Work through {count} pairs in rounds of up to {size}. Your timer starts when you play." },
  "match.start": { uk: "Почати Match", en: "Start matching" },
  "match.keyboardHint": { uk: "Натискайте на картки або використовуйте Tab і Enter.", en: "Tap to select, or use Tab and Enter on your keyboard." },
  "match.restart": { uk: "Почати заново", en: "Restart matching" },
};

const seoFor = (page: TPageSeed, locale: TLocale) => ({
  metaTitle: `${page.title[locale]} | QuizPet`.slice(0, 60),
  metaDescription:
    locale === "uk"
      ? `Сторінка «${page.title.uk}» у навчальному застосунку QuizPet.`
      : `The ${page.title.en} page in the QuizPet learning application.`,
  noIndex: page.noIndex === true || page.access !== "public",
});

const DEFAULT_LOCALE = "uk";

const ensureLocales = async (strapi: Core.Strapi) => {
  const localeService = strapi.plugin("i18n").service("locales");
  const existing = (await localeService.find()) as { code: string }[];
  const known = new Set(existing.map((item) => item.code));

  for (const locale of [
    { code: "uk", name: "Ukrainian" },
    { code: "en", name: "English" },
  ]) {
    if (!known.has(locale.code)) {
      await localeService.create(locale);
    }
  }

  // Strapi creates "en" as the default locale on a fresh install, so the
  // default is claimed once — when this seed introduces DEFAULT_LOCALE itself.
  if (!known.has(DEFAULT_LOCALE)) {
    await localeService.setDefaultLocale({ code: DEFAULT_LOCALE });
  }
};

const seedPages = async (strapi: Core.Strapi) => {
  const documents = strapi.documents("api::page.page");
  const ids = new Map<string, string>();
  const created = new Set<string>();

  const content = (page: TPageSeed, locale: TLocale) => ({
    title: page.title[locale],
    path: page.path[locale],
    showBreadcrumbs: page.showBreadcrumbs ?? true,
    blocks: page.blocks[locale],
    seo: seoFor(page, locale),
  });

  const stored = (await documents.findMany({
    locale: "uk",
    status: "draft",
    fields: ["routeName"],
    limit: -1,
  })) as unknown as { documentId: string; routeName: string }[];

  for (const item of stored) {
    ids.set(item.routeName, item.documentId);
  }

  for (const page of pages) {
    if (ids.has(page.routeName)) {
      continue;
    }

    const document = await documents.create({
      locale: "uk",
      status: "published",
      data: {
        routeName: page.routeName,
        access: page.access,
        layout: page.layout,
        priority: 0,
        ...content(page, "uk"),
      },
    });

    if (!document) {
      throw new Error(`Failed to seed page ${page.routeName}`);
    }

    ids.set(page.routeName, document.documentId);
    created.add(page.routeName);

    await documents.update({
      documentId: document.documentId,
      locale: "en",
      status: "published",
      data: content(page, "en"),
    });
  }

  for (const page of pages) {
    if (!created.has(page.routeName)) {
      continue;
    }

    const documentId = ids.get(page.routeName)!;
    const parent = page.parent ? ids.get(page.parent) : undefined;
    const redirectName =
      page.access === "authenticated"
        ? "login"
        : page.access === "guestOnly"
          ? "cabinet"
          : undefined;
    const redirectTo = redirectName ? ids.get(redirectName) : undefined;

    for (const locale of ["uk", "en"] as const) {
      await documents.update({
        documentId,
        locale,
        status: "published",
        data: {
          parent: parent ? { documentId: parent } : null,
          redirectTo: redirectTo ? { documentId: redirectTo } : undefined,
        },
      });
    }
  }

  return ids;
};

const seedTranslations = async (strapi: Core.Strapi) => {
  const documents = strapi.documents("api::translation.translation");

  const stored = (await documents.findMany({
    locale: "uk",
    fields: ["key"],
    limit: -1,
  })) as unknown as { key: string }[];
  const known = new Set(stored.map((item) => item.key));

  for (const [key, values] of Object.entries(translations)) {
    if (known.has(key)) {
      continue;
    }

    const document = await documents.create({
      locale: "uk",
      data: { key, value: values.uk, namespace: key.split(".")[0]! },
    });

    if (!document) {
      throw new Error(`Failed to seed translation ${key}`);
    }

    await documents.update({
      documentId: document.documentId,
      locale: "en",
      data: { value: values.en },
    });
  }
};

const seedGlobal = async (
  strapi: Core.Strapi,
  pageIds: Map<string, string>,
) => {
  const documents = strapi.documents("api::global.global");
  const existing = await documents.findFirst({ locale: "uk" });
  const common = {
    socialLinks: [
      {
        label: "GitHub",
        url: "https://github.com/pmaiko-org/quizpet",
        isExternal: true,
        icon: "i-lucide-github",
      },
      {
        label: "Telegram",
        url: "https://t.me/petyamaiko",
        isExternal: true,
        icon: "i-lucide-send",
      },
    ],
  };
  const localized = (locale: TLocale) => ({
    siteName: "QuizPet",
    footerTagline:
      locale === "uk"
        ? "Маленькі кроки, сильна пам’ять."
        : "Small steps, strong memory.",
    defaultSeo: {
      metaTitle: "QuizPet",
      metaDescription:
        locale === "uk"
          ? "Навчання за допомогою флеш-карток."
          : "Learning with flashcards.",
      noIndex: false,
    },
    sidebarLinks: [
      ["cabinet", locale === "uk" ? "Головна" : "Home", "i-lucide-home"],
      ["folders", locale === "uk" ? "Папки" : "Folders", "i-lucide-folder"],
      ["sets", locale === "uk" ? "Картки" : "Cards", "i-lucide-layers"],
      [
        "statistic",
        locale === "uk" ? "Статистика" : "Statistics",
        "i-lucide-bar-chart-3",
      ],
      ["people", locale === "uk" ? "Люди" : "People", "i-lucide-users"],
      ["pitanyachka", "ПІТАНЯЧКА", "i-lucide-dices"],
    ].map(([routeName, label, icon]) => ({
      label,
      page: { documentId: pageIds.get(routeName)! },
      isExternal: false,
      icon,
    })),
    footerLinks: [
      {
        label:
          locale === "uk"
            ? "Конфіденційність та умови"
            : "Privacy and terms",
        page: { documentId: pageIds.get("privacy")! },
        isExternal: false,
      },
    ],
  });
  if (existing) {
    return;
  }

  const document = await documents.create({
    locale: "uk",
    data: { ...common, ...localized("uk") },
  });

  if (!document) {
    throw new Error("Failed to seed global content");
  }

  await documents.update({
    documentId: document.documentId,
    locale: "en",
    data: localized("en"),
  });
};

export const seed = async (strapi: Core.Strapi) => {
  await ensureLocales(strapi);
  const pageIds = await seedPages(strapi);
  await seedTranslations(strapi);
  await seedGlobal(strapi, pageIds);
};

const main = async () => {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    await seed(app);
  } finally {
    await app.destroy();
  }
};

if (require.main === module) {
  void main();
}
