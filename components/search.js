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
  const zone = _get(router,'query.zone',"")
  const [name, setName] = React.useState('');
  const [inputName, setInputName] = React.useState('');

  const [type, setType] = React.useState('');
  const [inputType, setInputType] = React.useState('');

  const fixtureNameTypeSearch = () => {
    let searchQuery = {};
    if(inputType.length > 1) {
      searchQuery.type = encodeURIComponent(inputType);
    }
    if(inputName.length > 1) {
      searchQuery.name = encodeURIComponent(inputName);
    }
    router.push({
      query: searchQuery
    }, undefined, { shallow: true })
  }

  const zonequery = zone.length > 0 ? `?zone=${zone}` : "";
  const listItems = _map(fixtures, (fixture, index) =>
    <Grid item xs={6} sm={3} key={`grid-${index}`}>
      <Card {...fixture} href={`${cardhref}${fixture.id}${zonequery}`} />
    </Grid>
  )

  return (
    <main className={styles.main}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <div className="input-search">
          <div className="input-autocomplete">
            <div className="input-text">
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
                options={fixtureTypes.map((option) => option.type)}
                renderInput={(params) => <TextField {...params} label="Filter via Type" />}
              />
            </div>
            <div>
              <TextField value={inputName}
                fullWidth
                onChange={(e) => {
                  setInputName(e.target.value);
                }} 
                label="Search Fixture via name" />
            </div>
          </div>
          <Button variant="contained" size="large" onClick={fixtureNameTypeSearch}>Go</Button>
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