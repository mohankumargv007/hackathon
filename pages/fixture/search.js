import { useState } from "react";
import { supabaseConnection } from '../../utils/supabase';
import SearchFixture from '../../components/fixture';
import { createClient } from '@supabase/supabase-js';
import getConfig from 'next/config';
import { FixtureProvider } from '../../contexts/fixtureContext';

const { serverRuntimeConfig } = getConfig();

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')


  console.log(data, error);
  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
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
