import { RESERVED_METADATA_NAME_KEYWORDS } from '@/metadata/index';

export const addCustomSuffixIfIsReserved = (name: string): string => {
  if (!name) return name;

  return RESERVED_METADATA_NAME_KEYWORDS.includes(name)
    ? `${name}Custom`
    : name;
};
