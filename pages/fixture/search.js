import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/fixture';
import { FixtureProvider } from '../../contexts/fixtureContext';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')

  return { props: { data: data } };
}

export default function Fixture(props) {
  return (
    <FixtureProvider>
      <SearchFixture {...props} />
    </FixtureProvider>
  )
}
