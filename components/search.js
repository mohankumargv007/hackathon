import * as React from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqBy from 'lodash/uniqBy';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Card from './card';
import styles from './../styles/Search.module.css';

export default function Search(props) {
  const router = useRouter();
  const { cardhref, fixtureTypes } = props;
  const allfixtures = _get(props, "fixtureLibrary", []);
  let fixtures = _cloneDeep(allfixtures);

  const [name, setName] = React.useState('');
  const [inputName, setInputName] = React.useState('');

  const [type, setType] = React.useState('');
  const [inputType, setInputType] = React.useState('');

  const fixtureTypeSearch = () => {
    if(inputType.length > 1) {
      let searchQuery = `?type=${inputType}`;
      if(inputName.length > 1) {
        searchQuery = `?type=${inputType}&name=${inputName}`;
      }
      router.push(searchQuery, undefined, { shallow: true });
    } else if(inputType.length == 0){
      let searchQuery = ``;
      if(inputName.length > 1) {
        searchQuery = `?name=${inputName}`;
      }
      router.push(searchQuery, undefined, { shallow: true });
    }
  }

  if(name) {
    fixtures = fixtures.filter((fixt) => {
      return fixt.name.includes(name);
    })
  }

  const listItems = _map(fixtures, (fixture, index) =>
    <Grid item xs={6} sm={3} key={`grid-${index}`}>
      <Card {...fixture} href={`${cardhref}${fixture.id}`} />
    </Grid>
  )

  return (
    <main className={styles.main}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <div className="input-search">
          <Autocomplete
            value={type}
            onChange={(event, newValue) => {
              setType(newValue);
            }}
            inputValue={inputType}
            onInputChange={(event, newInputType) => {
              setInputType(newInputType);
            }}
            className="input-text"
            id="search-fixture-type"
            autoComplete
            options={fixtureTypes.map((option) => option.type)}
            renderInput={(params) => <TextField {...params} label="Filter via Type" />}
          />
          <Button variant="contained" onClick={fixtureTypeSearch}>Go</Button>
        </div>
        <div className="input-search">
          <Autocomplete
            value={name}
            onChange={(event, newValue) => {
              setName(newValue);
            }}
            inputValue={inputName}
            onInputChange={(event, newInputName) => {
              setInputName(newInputName);
            }}
            className="input-text"
            id="search-fixture-name"
            autoComplete
            options={_uniqBy(fixtures, 'name').map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Search Fixture via name" />}
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