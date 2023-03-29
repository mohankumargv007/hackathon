import _filter from 'lodash/filter';
import _includes from 'lodash/includes';
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/merchandise/search';
import { FixtureProvider } from '../../contexts/fixtureContext';

const merchadiseTypes = ["arm", "prong", "shelves"];

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')
  .eq('status', true)

  // Filter data
  data = _filter(data, (o) => {
    if(_includes(o.type.toLowerCase(), "arm")) {
      return true;
    } else if (_includes(o.type.toLowerCase(), "prong")) {
      return true;
    } else if(_includes(o.type.toLowerCase(), "shelves")) {
      return true;
    } else {
      return false;
    }
  });

  return { props: { data: data } };
}

export default function Fixture(props) {
  return (
    <SearchFixture {...props} />
  )
}
