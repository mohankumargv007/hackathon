import * as React from 'react';
import { useRef } from "react";
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import styles from '../../styles/Search.module.css';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Card from '../../components/fixture/card';
import { supabaseConnection } from '../../utils/supabase';

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')

  return { props: { data: data } };
}

export default function Search(props) {
  const allfixtures = useRef(_get(props, "data", []));
  let fixtures = _cloneDeep(allfixtures);

  const [name, setName] = React.useState('');
  const [inputName, setInputName] = React.useState('');

  const [type, setType] = React.useState('');
  const [inputType, setInputType] = React.useState('');

  if(name) {
    fixtures = fixtures.filter((fixt) => {
      return fixt.name.includes(name);
    })
  }

  if(type) {
    fixtures = fixtures.filter((fixt) => {
      return fixt.type.includes(type);
    })
  }

  const listItems = fixtures.map((fixture, index) =>
    <Grid item xs={6} key={`grid-${index}`}>
      <Card {...fixture} />
    </Grid>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Stack sx={{ width: "100%" }}>
          <div>
            <h4>Name: {name}</h4>
            <Autocomplete
              value={name}
              onChange={(event, newValue) => {
                setName(newValue);
              }}
              inputValue={inputName}
              onInputChange={(event, newInputName) => {
                setInputName(newInputName);
              }}
              id="search-fixture-name"
              autoComplete
              options={fixtures.map((option) => option.name)}
              renderInput={(params) => <TextField {...params} label="Search Fixture via name" />}
            />
          </div>
          <div>
            <h4>Type: {type}</h4>
            <Autocomplete
              value={type}
              onChange={(event, newValue) => {
                setType(newValue);
              }}
              inputValue={inputType}
              onInputChange={(event, newInputType) => {
                setInputType(newInputType);
              }}
              id="search-fixture-type"
              autoComplete
              options={fixtures.map((option) => option.type)}
              renderInput={(params) => <TextField {...params} label="Filter via type" />}
            />
          </div>
          <div>
            <h3>Fixtures</h3>
            <div>
              <Grid container spacing={1}>
                {listItems}
              </Grid>
            </div>
          </div>
        </Stack>
      </main>
    </div>
  )
}