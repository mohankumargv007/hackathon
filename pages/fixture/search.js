import { useEffect } from 'react';
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/fixture/search';
import { useAppContext } from '../../contexts/appContext';

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
  const { setTitle } = useAppContext();

  useEffect(() => {
    setTitle("Select Fixture");
  }, []);

  return (
    <SearchFixture {...props} />
  )
}
