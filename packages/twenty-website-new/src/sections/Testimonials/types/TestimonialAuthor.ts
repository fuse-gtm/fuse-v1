import type { BodyType } from '@/design-system/components/Body/types/Body';

export type TestimonialAuthorType = {
  name: BodyType;
  designation: BodyType;
  date?: Date | number;
  avatar?: {
    src: string;
    alt?: string;
  };
};
