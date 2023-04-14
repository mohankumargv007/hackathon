import * as React from 'react';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqBy from 'lodash/uniqBy';
import _map from 'lodash/map';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Card from './card';
import styles from '../../../styles/Search.module.css';

const merchadiseTypes = [{
    type: "Arm"
  }, {
    type: "Prong"
  }, {
    type: "Shelves"
  }];

export default function Home(props) {
  const allfixtures = _get(props, "data", []);
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

  const listItems = _map(fixtures, (fixture, index) =>
    <Grid item xs={6} key={`grid-${index}`}>
      <Card {...fixture} />
    </Grid>
  );

  return (
    <main className={styles.main}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <div>
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
            options={_uniqBy(fixtures, 'name').map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Search Fixture via name" />}
          />
        </div>
        <div>
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
            options={merchadiseTypes.map((option) => option.type)}
            renderInput={(params) => <TextField {...params} label="Filter via Type" />}
          />
        </div>
        <h3>Fixtures</h3>
        <div>
          <Grid container spacing={1}>
            {listItems}
          </Grid>
        </div>
      </Stack>
    </main>
  )
}