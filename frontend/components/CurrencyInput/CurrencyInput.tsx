import { NativeSelect, rem, TextInput } from '@mantine/core';

const data = [
  { value: 'eur', label: '🇪🇺 EUR' },
  { value: 'usd', label: '🇺🇸 USD' },
  { value: 'cad', label: '🇨🇦 CAD' },
  { value: 'gbp', label: '🇬🇧 GBP' },
  { value: 'aud', label: '🇦🇺 AUD' },
];

export function CurrencyInput() {
  const select = (
    <NativeSelect
      data={data}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(92),
        },
      }}
    />
  );

  return (
    <TextInput
      type="number"
      placeholder="1000"
      label="Transfer amount"
      rightSection={select}
      rightSectionWidth={92}
    />
  );
}
