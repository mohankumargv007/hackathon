import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import _get from 'lodash/get';
import Layout from '../../components/layout';
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/search';
import Pagination from '../../components/pagination';

const { publicRuntimeConfig } = getConfig()
const fixturesInPage = publicRuntimeConfig.fixturesInPage;

export async function getServerSideProps(context) {
  // Fetch data from external API
  const page = _get(context, "query.page", 1);
  const startRange = (page - 1) * fixturesInPage;
  const endRange = (page * fixturesInPage) - 1;

  const supabase = supabaseConnection();

  let { data: fixtureLibrary, count: fixtureCount, error } = await supabase
  .from('fixture_library')
  .select('*', { count: 'exact' })
  .or('type.ilike.%arm%,type.ilike.%prong%,type.ilike.%shelves%')
  .eq('status', true)
  .range(startRange, endRange)

  return { props: { fixtures: fixtureLibrary,  fixtureCount: fixtureCount }};
}

export default function Fixture(props) {
  const { loginDetails, fixtures, fixtureCount } = props;
  const mounted = useRef(false);
  const [fixtureLibrary, setFixtureLibrary] = useState(fixtures);
  const router = useRouter();
  const page = _get(router, "query.page", 1);

  const getFixtureLibrary = async () => {
    const url = `/api/fixture/fixtureLibrary?page=${_get(router, "query.page", 1)}&type=armsprongsshelves`;
    const response = await fetch(url);
    const { fixtureLibrary } = await response.json();
    setFixtureLibrary(fixtureLibrary);
  };

  useEffect(() => {
    if (mounted.current) {
      getFixtureLibrary();
    } else {
      mounted.current = true;
    }
  }, [page]);

  return (
    <Layout title="Select Fixture" loginDetails={loginDetails}>
      <SearchFixture {...props} fixtureLibrary={fixtureLibrary} merchadiseTypesFlag={false} cardhref={`/merchandise/fid/`} />
      {fixtureCount/fixturesInPage > 1 &&
        <Pagination fixtureCount={fixtureCount} fixturesInPage={fixturesInPage} pages={Math.ceil(fixtureCount/fixturesInPage)} />
      }
    </Layout>
  )
}
