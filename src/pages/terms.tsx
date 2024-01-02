import {observer} from 'mobx-react';

import {TermsOfServices} from '@/bridge/ui/TermsOfServices';
import {CustomHtmlHead} from '@/core/ui/CustomHtmlHead';
import {AppFooter, AppHeader} from '@/core/ui/Layout';
import {PageLayout} from '@/core/ui/PageLayout';
import {Panel} from '@/core/ui/Panel';

import {NextPageWithLayout} from '../../types/next';

const BridgePage: NextPageWithLayout = () => {
  return (
    <Panel title='Shimmer Bridge Terms of Service' sx={{width: '664px'}}>
      <TermsOfServices />
    </Panel>
  );
};

BridgePage.getLayout = (page) => (
  <PageLayout centered header={<AppHeader />} footer={<AppFooter />}>
    <CustomHtmlHead title='Terms Of Services' />
    {page}
  </PageLayout>
);

export default observer(BridgePage);
