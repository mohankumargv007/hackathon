import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import _get from 'lodash/get';
import Layout from '../../../components/layout';
import { supabaseConnection } from '../../../utils/supabase';
import SearchFixture from '../../../components/search';
import Pagination from '../../../components/pagination';

const { publicRuntimeConfig } = getConfig()
const fixturesInPage = publicRuntimeConfig.fixturesInPage;

const fixtureTypes = [{
    type: "Arm"
  }, {
    type: "Prong"
  }, {
    type: "Shelves&Bins"
  }];

export async function getServerSideProps(context) {
  // Fetch data from external API
  const page = _get(context, "query.page", 1);
  const type = decodeURIComponent(_get(context, "query.type", ""));
  const name = decodeURIComponent(_get(context, "query.name", ""));

  const startRange = (page - 1) * fixturesInPage;
  const endRange = (page * fixturesInPage) - 1;

  const supabase = supabaseConnection();

  let query = supabase
  .from('fixture_library')
  .select('*', { count: 'exact' });

  if(type.length > 0) {
    query.eq('type', type);
  } else {
    query.or('type.ilike.%arm%,type.ilike.%prong%,type.ilike.%shelves%');
  }
  query.eq('status', true);
  if(name.length > 0) query.textSearch('name', `'${name}'`);
  query.range(startRange, endRange);

  const { data: fixtureLibrary, count: fixtureCount, error: fixtureError } = await query;
  return { props: { fixtures: fixtureLibrary,  fixtureCount: fixtureCount }};
}

export default function Fixture(props) {
  const mounted = useRef(false);
  const [fixtureLibrary, setFixtureLibrary] = useState(_get(props, "fixtures"));
  const [fixtureCount, setFixtureCount] = useState(_get(props, "fixtureCount"));
  const router = useRouter();
  const page = _get(router, "query.page", 1);
  const type = _get(router, "query.type", "armsprongsshelves");
  const name = _get(router, "query.name", "");

  const getFixtureLibrary = async () => {
    let url = `/api/fixture/fixtureLibrary?page=${page}&type=${type}`;
    if(name) url = `${url}&name=${name}`;
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
  }, [page, type, name]);

  return (
    <Layout title="Select Fixture" {...props} footer={{title:"Remove Fixture", link:"/fixture/remove"}}>
      <SearchFixture {...props} fixtureLibrary={fixtureLibrary} fixtureTypes={fixtureTypes} cardhref={`/fixture/remove/fid/`} />
      {fixtureCount/fixturesInPage > 1 &&
        <Pagination fixtureCount={fixtureCount} fixturesInPage={fixturesInPage} pages={Math.ceil(fixtureCount/fixturesInPage)} />
      }
    </Layout>
  )
}