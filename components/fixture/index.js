import * as React from 'react';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import styles from '../../styles/Search.module.css';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Card from './card';

export default function Home(props) {
  const allfixtures = _get(props, "data");
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
        <Stack spacing={2} sx={{ width: "100%" }}>
          <h3>Name: {name}</h3>
          <Autocomplete
            value={name}
            onChange={(event, newValue) => {
              setName(newValue);
            }}
            inputValue={inputName}
            onInputChange={(event, newInputName) => {
              setInputName(newInputName);
            }}
            id="free-solo-demo"
            autoComplete
            options={fixtures.map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Search Fixture via name" />}
          />
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
            id="free-solo-demo"
            autoComplete
            options={fixtures.map((option) => option.type)}
            renderInput={(params) => <TextField {...params} label="Filter via type" />}
          />
          <h3>Fixtures</h3>
          <div>
            <Grid container spacing={1}>
              {listItems}
            </Grid>
          </div>
        </Stack>
      </main>
    </div>
  )
}