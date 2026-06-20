import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsTwentyProps = {
  i18n: I18n;
};

export const WhatIsTwenty = ({ i18n }: WhatIsTwentyProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is Fuse?')} />
      <MainText>
        {i18n._(
          'Fuse is a partnerships operating system for managing partner programs, accounts, attribution, and collaboration workflows.',
        )}
      </MainText>
    </>
  );
};
