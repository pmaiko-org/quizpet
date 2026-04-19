const CYRILLIC_PATTERN = /[А-Яа-яІіЇїЄєҐґ]/;

const VOICE_PRIORITY: Record<string, string[]> = {
  "uk-UA": ["Microsoft Ostap", "Google українська", "Ukrainian"],
  "en-US": ["Google US English", "Microsoft Aria Online", "Samantha", "Alex"],
};

const detectLanguage = (text: string) => {
  return CYRILLIC_PATTERN.test(text) ? "uk-UA" : "en-US";
};

export const useCardSpeech = () => {
  const isSupported = ref(false);
  const isSpeaking = ref(false);
  const speakingText = ref<string | null>(null);
  const voices = ref<SpeechSynthesisVoice[]>([]);

  let activeUtterance: SpeechSynthesisUtterance | null = null;

  const loadVoices = () => {
    if (!window.speechSynthesis) {
      voices.value = [];
      return;
    }

    voices.value = window.speechSynthesis.getVoices();
  };

  const pickVoice = (language: string) => {
    const normalizedLang = language.toLowerCase();
    const candidates = voices.value.filter(
      voice =>
        voice.lang.toLowerCase() === normalizedLang
        || voice.lang.toLowerCase().startsWith(normalizedLang.slice(0, 2)),
    );

    const preferredNames = VOICE_PRIORITY[language] ?? [];

    for (const preferredName of preferredNames) {
      const matched = candidates.find(voice =>
        voice.name.toLowerCase().includes(preferredName.toLowerCase()),
      );

      if (matched) {
        return matched;
      }
    }

    return (
      candidates[0]
      ?? voices.value.find(voice => voice.lang.startsWith("en"))
      ?? null
    );
  };

  const stop = () => {
    if (!isSupported.value) {
      return;
    }

    window.speechSynthesis.cancel();
    activeUtterance = null;
    isSpeaking.value = false;
    speakingText.value = null;
  };

  const speak = (text: string, language?: string) => {
    if (!isSupported.value || !text.trim()) {
      return false;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    const lang = language ?? detectLanguage(text);
    const selectedVoice = pickVoice(lang);

    utterance.lang = selectedVoice?.lang ?? lang;
    utterance.voice = selectedVoice;
    utterance.rate = 0.94;
    utterance.pitch = 1;

    utterance.onstart = () => {
      activeUtterance = utterance;
      isSpeaking.value = true;
      speakingText.value = text;
    };

    utterance.onend = () => {
      if (activeUtterance === utterance) {
        activeUtterance = null;
        isSpeaking.value = false;
        speakingText.value = null;
      }
    };

    utterance.onerror = () => {
      if (activeUtterance === utterance) {
        activeUtterance = null;
        isSpeaking.value = false;
        speakingText.value = null;
      }
    };

    window.speechSynthesis.speak(utterance);

    return true;
  };

  onMounted(() => {
    isSupported.value = "speechSynthesis" in window;

    if (!isSupported.value) {
      return;
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  });

  onBeforeUnmount(() => {
    stop();

    if (isSupported.value) {
      window.speechSynthesis.onvoiceschanged = null;
    }
  });

  return {
    isSupported,
    isSpeaking,
    speakingText,
    speak,
    stop,
  };
};
