import _filter from 'lodash/filter';
import _includes from 'lodash/includes';
import Layout from '../../components/layout';
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/merchandise/search';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')
  .or('type.ilike.%arm%,type.ilike.%prong%,type.ilike.%shelves%')

  return { props: { data: data, error: error } };
}

export default function Fixture(props) {
  return (
    <Layout title="Select Fixture">
      <SearchFixture {...props} />
    </Layout>
  )
}
