import Layout from '../../components/layout';
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/fixture/search';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')
  .eq('status', true)

  return { props: { data: data } };
}

export default function Fixture(props) {
  return (
    <Layout title="Select Fixture">
      <SearchFixture {...props} />
    </Layout>
  )
}
