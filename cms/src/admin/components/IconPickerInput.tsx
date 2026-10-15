import { Button, Field, Flex, Popover, Searchbar, Typography } from "@strapi/design-system";
import { useField } from "@strapi/strapi/admin";
import * as React from "react";

const ICON_PREFIX = "i-lucide-";
const MAX_RESULTS = 120;

type TIconSet = {
  width?: number;
  height?: number;
  icons: Record<string, { body: string; width?: number; height?: number }>;
  aliases?: Record<string, { parent: string }>;
};

type TIcon = { code: string; name: string; body: string; viewBox: string };

let cache: Promise<TIcon[]> | undefined;

const loadIcons = () => {
  cache ??= import("@iconify-json/lucide/icons.json").then((module) => {
    const set = (module.default ?? module) as TIconSet;
    const width = set.width ?? 24;
    const height = set.height ?? 24;

    return Object.entries(set.icons).map(([name, icon]) => ({
      code: `${ICON_PREFIX}${name}`,
      name,
      body: icon.body,
      viewBox: `0 0 ${icon.width ?? width} ${icon.height ?? height}`,
    }));
  });

  return cache;
};

const IconPreview = ({ icon, size = 20 }: { icon: TIcon; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox={icon.viewBox}
    aria-hidden
    focusable="false"
    dangerouslySetInnerHTML={{ __html: icon.body }}
  />
);

type TProps = {
  name?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  labelAction?: React.ReactNode;
};

const IconPickerInput = React.forwardRef<HTMLButtonElement, TProps>(
  ({ name = "", label, hint, required, disabled, labelAction }, ref) => {
    const field = useField<string>(name);
    const [icons, setIcons] = React.useState<TIcon[]>([]);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
      let active = true;
      loadIcons().then((loaded) => {
        if (active) setIcons(loaded);
      });
      return () => {
        active = false;
      };
    }, []);

    const selected = icons.find((icon) => icon.code === field.value);
    const query = search.trim().toLowerCase();
    const results = (
      query ? icons.filter((icon) => icon.name.includes(query)) : icons
    ).slice(0, MAX_RESULTS);

    const select = (code: string | null) => field.onChange(name, code ?? "");

    return (
      <Field.Root name={name} id={name} error={field.error} hint={hint} required={required}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <Flex gap={2} alignItems="center">
          <Popover.Root>
            <Popover.Trigger>
              <Button ref={ref} variant="tertiary" disabled={disabled}>
                <Flex gap={2} alignItems="center">
                  {selected ? <IconPreview icon={selected} /> : null}
                  <Typography>{field.value || "Select an icon"}</Typography>
                </Flex>
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Flex direction="column" alignItems="stretch" gap={2} padding={3} width="420px">
                <Searchbar
                  name={`${name}-search`}
                  value={search}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(event.target.value)
                  }
                  onClear={() => setSearch("")}
                  clearLabel="Clear search"
                >
                  Search icons
                </Searchbar>
                <Flex wrap="wrap" gap={1} maxHeight="280px" overflow="auto" alignItems="flex-start">
                  {results.map((icon) => (
                    <Button
                      key={icon.code}
                      variant={icon.code === field.value ? "secondary" : "ghost"}
                      onClick={() => select(icon.code)}
                      title={icon.code}
                      aria-label={icon.code}

                    >
                      <IconPreview icon={icon} />
                    </Button>
                  ))}
                  {results.length === 0 ? (
                    <Typography textColor="neutral600">No icons found</Typography>
                  ) : null}
                </Flex>
                <Typography variant="pi" textColor="neutral600">
                  {`Showing ${results.length} of ${icons.length}`}
                </Typography>
              </Flex>
            </Popover.Content>
          </Popover.Root>
          {field.value ? (
            <Button variant="tertiary" onClick={() => select(null)} disabled={disabled}>
              Clear
            </Button>
          ) : null}
        </Flex>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    );
  },
);

IconPickerInput.displayName = "IconPickerInput";

export default IconPickerInput;
