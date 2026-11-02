import { compileStrapi, createStrapi } from "@strapi/strapi";
import type { Core } from "@strapi/strapi";

import {
  globalTranslationEntries,
  widgetTranslations,
  widgetTranslationsWithLegacyValues,
} from "./seed/translations";
import type { TLocale } from "./seed/translations";

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
    blocks: page.blocks[locale].map((block) => {
      const widgetMessages = widgetTranslations(block.__component, locale);

      return widgetMessages.length ? { ...block, translations: widgetMessages } : block;
    }) as never,
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

  for (const { key, namespace, values } of globalTranslationEntries) {
    if (known.has(key)) {
      continue;
    }

    const document = await documents.create({
      locale: "uk",
      data: { key, value: values.uk, namespace },
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

const backfillWidgetTranslations = async (strapi: Core.Strapi) => {
  const translationDocuments = strapi.documents("api::translation.translation");
  const pageDocuments = strapi.documents("api::page.page");

  for (const locale of ["uk", "en"] as const) {
    const storedTranslations = (await translationDocuments.findMany({
      locale,
      fields: ["key", "value"],
      limit: -1,
    })) as unknown as Array<{ key: string; value: string }>;
    const storedValues = Object.fromEntries(
      storedTranslations.map(({ key, value }) => [key, value]),
    );
    const storedPages = (await pageDocuments.findMany({
      locale,
      status: "draft",
      fields: ["documentId"],
      populate: { blocks: { populate: "*" } },
      limit: -1,
    })) as unknown as Array<{
      documentId: string;
      blocks?: Array<TBlock & { id: number; translations?: unknown[] }>;
    }>;

    for (const page of storedPages) {
      let changed = false;
      const blocks = (page.blocks ?? []).map((block) => {
        const widgetMessages = widgetTranslationsWithLegacyValues(
          block.__component,
          locale,
          storedValues,
        );

        if (!widgetMessages.length || block.translations?.length) {
          return block;
        }

        changed = true;
        return { ...block, translations: widgetMessages };
      });

      if (changed) {
        await pageDocuments.update({
          documentId: page.documentId,
          locale,
          status: "published",
          data: { blocks: blocks as never },
        });
      }
    }
  }
};

const seedGlobal = async (strapi: Core.Strapi, pageIds: Map<string, string>) => {
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
      locale === "uk" ? "Маленькі кроки, сильна пам’ять." : "Small steps, strong memory.",
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
        label: locale === "uk" ? "Конфіденційність та умови" : "Privacy and terms",
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
  await backfillWidgetTranslations(strapi);
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
