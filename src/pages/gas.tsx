import {CustomHtmlHead} from '@/core/ui/CustomHtmlHead';
import {AppFooter, AppHeader} from '@/core/ui/Layout';
import {PageLayout} from '@/core/ui/PageLayout';
import {Panel} from '@/core/ui/Panel';
import {GasBridge} from '@/gas/ui/GasBridge';

import {NextPageWithLayout} from '../../types/next';

const GasPage: NextPageWithLayout = () => {
  // return (
  //   <Panel>
  //     <GasBridge />
  //   </Panel>
  // );
  return null;
};

GasPage.getLayout = (page) => (
  <PageLayout centered header={<AppHeader />} footer={<AppFooter />}>
    <CustomHtmlHead title='Gas Drop' />
    {page}
  </PageLayout>
);

export default GasPage;
