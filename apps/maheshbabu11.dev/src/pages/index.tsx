import { getBaseUrl } from '@/helpers/url';

import IndexContents from '@/contents/index';
import Head from '@/meta/Head';

function Index() {
  return (
    <>
      <Head
        title="Mahesh Babu | Back-End Developer"
        description="An online portfolio featuring a showcase of my projects and some thoughts as a Back-End Developer who loves to build efficient and scalable systems."
        ogImage={`${getBaseUrl()}/assets/images/og-image.png`}
        overrideTitle
      />
      <IndexContents />
    </>
  );
}

export default Index;
