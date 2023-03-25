import { useState } from "react";
import { supabaseConnection } from '../utils/supabase';
import SearchFixture from '../components/searchFixture';
import { FixtureProvider } from '../contexts/fixtureContext';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data: test, error } = await supabase
  .from('test')
  .select('*');

  // Pass data to the page via props
  return { props: { data: test } };
}

export default function Fixture(props) {
  console.log(props);
  const [languageSelected, setLanguageSelected] = useState("en");
  return (
    <FixtureProvider value={{
      languageSelected: languageSelected,
      setLanguageSelected: setLanguageSelected
    }}>
      <SearchFixture {...props} />
    </FixtureProvider>
  )
}
