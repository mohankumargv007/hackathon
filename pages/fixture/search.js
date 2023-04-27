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
  const type = _get(context, "query.type");

  const startRange = (page - 1) * fixturesInPage;
  const endRange = (page * fixturesInPage) - 1;

  const supabase = supabaseConnection();

  let query = supabase
  .from('fixture_library')
  .select('*', { count: 'exact' })
  .eq('status', true)

  if(type) query.textSearch('type', `'${type}'`)
  query.range(startRange, endRange)

  const { data: fixtureLibrary, count: fixtureCount, error: fixtureError } = await query;
  const { data: fixtureTypes, error } = await supabase.rpc('get_fixture_types');

  return { props: { fixtures: fixtureLibrary,  fixtureCount: fixtureCount, fixtureTypes: fixtureTypes }};
}

export default function Fixture(props) {
  const { loginDetails, fixtureTypes } = props;
  const mounted = useRef(false);
  const [fixtureLibrary, setFixtureLibrary] = useState(_get(props, "fixtures"));
  const [fixtureCount, setFixtureCount] = useState(_get(props, "fixtureCount"));
  const router = useRouter();
  const page = _get(router, "query.page", 1);
  const type = _get(router, "query.type", "");

  const getFixtureLibrary = async () => {
    const url = `/api/fixture/fixtureLibrary?page=${page}&type=${type}`;
    const response = await fetch(url);
    const { fixtureLibrary, count } = await response.json();
    setFixtureLibrary(fixtureLibrary);
    setFixtureCount(count);
  };

  useEffect(() => {
    if (mounted.current) {
      getFixtureLibrary();
    } else {
      mounted.current = true;
    }
  }, [page, type]);

  return (
    <Layout title="Select Fixture" loginDetails={loginDetails}>
      <SearchFixture {...props} fixtureLibrary={fixtureLibrary} fixtureTypes={fixtureTypes} cardhref={`/fixture/`} />
      {fixtureCount/fixturesInPage > 1 &&
        <Pagination fixtureCount={fixtureCount} fixturesInPage={fixturesInPage} pages={Math.ceil(fixtureCount/fixturesInPage)} />
      }
    </Layout>
  )
}
