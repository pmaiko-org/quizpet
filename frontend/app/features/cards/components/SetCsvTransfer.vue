<template>
  <div
    class="
      rounded-3xl border border-default bg-default/80 p-5 shadow-sm
      sm:p-6
    "
  >
    <div
      class="
        flex flex-col gap-4
        lg:flex-row lg:items-start lg:justify-between
      "
    >
      <div class="space-y-2">
        <p class="text-xs font-medium tracking-[0.24em] text-primary uppercase">
          CSV
        </p>
        <h3 class="text-lg font-semibold text-highlighted">
          Імпорт і експорт карток
        </h3>
        <p class="max-w-2xl text-sm/6 text-toned">
          CSV працює з колонками <code>term</code>,
          <code>termDescription</code> і <code>definition</code>. Імпорт
          повністю замінює поточний список карток у формі.
        </p>
      </div>

      <div
        class="
          flex flex-col gap-3
          sm:flex-row
        "
      >
        <UButton
          type="button"
          size="lg"
          variant="outline"
          color="neutral"
          icon="i-lucide-download"
          :disabled="!cards.length"
          @click="exportCsv"
        >
          Експортувати CSV
        </UButton>

        <UButton
          type="button"
          size="lg"
          variant="soft"
          color="primary"
          icon="i-lucide-upload"
          @click="openFilePicker"
        >
          Імпортувати CSV
        </UButton>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".csv,text/csv"
      @change="onFileChange"
    >
  </div>
</template>

<script setup lang="ts">
import { type ICardFormData, initialCard } from "~/features/cards/types";

interface CsvRow {
  term: string;
  termDescription: string;
  definition: string;
}

const props = defineProps<{
  cards: ICardFormData[];
}>();

const emit = defineEmits<{
  importCards: [cards: ICardFormData[]];
}>();

const toast = useToast();
const fileInput = ref<HTMLInputElement | null>(null);

const openFilePicker = () => {
  fileInput.value?.click();
};

const exportCsv = () => {
  const rows = [
    ["term", "termDescription", "definition"],
    ...props.cards.map(card => [
      card.term ?? "",
      card.termDescription ?? "",
      card.definition ?? "",
    ]),
  ];

  const csv = rows
    .map(row => row.map(value => escapeCsvValue(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "cards.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0];

  if (!file) {
    return;
  }

  try {
    const csv = await file.text();
    const importedRows = parseCsv(csv);

    if (!importedRows.length) {
      throw new Error(
        "CSV не містить жодного рядка з term, termDescription і definition.",
      );
    }

    emit(
      "importCards",
      importedRows.map((row, index) => ({
        ...initialCard(index),
        term: row.term,
        termDescription: row.termDescription,
        definition: row.definition,
      })),
    );

    toast.add({
      title: "CSV імпортовано",
      description: `Завантажено ${importedRows.length} карток.`,
    });
  } catch (error) {
    toast.add({
      title: "Не вдалося імпортувати CSV",
      description:
        error instanceof Error ? error.message : "Перевірте формат файлу.",
      color: "error",
    });
  } finally {
    if (target) {
      target.value = "";
    }
  }
};

const escapeCsvValue = (value: string) => {
  const normalizedValue = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const escapedValue = normalizedValue.replace(/"/g, "\"\"");

  return `"${escapedValue}"`;
};

const parseCsv = (input: string): CsvRow[] => {
  const normalizedInput = input.replace(/^\uFEFF/, "");
  const rows = parseCsvRows(normalizedInput).filter(row =>
    row.some(cell => cell.trim().length),
  );

  if (!rows.length) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;
  const headerMap = new Map(
    headerRow?.map((column, index) => [column.trim().toLowerCase(), index]),
  );

  const termIndex = headerMap.get("term");
  const termDescriptionIndex = headerMap.get("termdescription");
  const definitionIndex = headerMap.get("definition");

  if (
    termIndex === undefined
    || termDescriptionIndex === undefined
    || definitionIndex === undefined
  ) {
    throw new Error(
      "CSV має містити заголовки term, termDescription і definition.",
    );
  }

  return dataRows
    .map(row => ({
      term: row[termIndex]?.trim() ?? "",
      termDescription: row[termDescriptionIndex]?.trim() ?? "",
      definition: row[definitionIndex]?.trim() ?? "",
    }))
    .filter(
      row =>
        row.term.length || row.termDescription.length || row.definition.length,
    );
};

const parseCsvRows = (input: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (char === "\"") {
      if (insideQuotes && nextChar === "\"") {
        currentCell += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (char === "\n" && !insideQuotes) {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (insideQuotes) {
    throw new Error("CSV містить незакриті лапки.");
  }

  if (currentCell.length || currentRow.length) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
};
</script>
