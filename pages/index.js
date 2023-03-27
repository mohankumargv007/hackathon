import { useState } from "react";
import { supabaseConnection } from '../utils/supabase';
import HomePage from '../components/home';
import { HomeWrapper } from '../contexts/homeContext';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')

  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Home(props) {
  console.log(props);
  const [languageSelected, setLanguageSelected] = useState("en");
  return (
    <HomeWrapper value={{
      languageSelected: languageSelected,
      setLanguageSelected: setLanguageSelected
    }}>
      <HomePage {...props} />
    </HomeWrapper>
  )
}
