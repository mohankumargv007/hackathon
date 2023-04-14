import _get from 'lodash/get';
import Stack from '@mui/material/Stack';

export default function Fixture(props) {
  const fixture = _get(props, "fixture", {});

  return (
    <Stack spacing={1}>
    <h2 className="no-margig">{fixture.name}</h2>
    {fixture.type &&<p><b>Type: </b>{fixture.type}</p>}
    {fixture.component_length && <p><b>Length: </b>{fixture.component_length}</p>}
    {fixture.component_width && <p><b>Width: </b>{fixture.component_width}</p>}
    {fixture.component_height && <p><b>Height: </b>{fixture.component_height}</p>}
    {fixture.front_image && <>
      <label><b>Front Image</b></label>
      <img src={fixture.front_image} width="100%" style={{"maxWidth":"400px"}} />
    </>}
    {fixture.cad_image && <>
      <label><b>CAD Image</b></label>
      <img src={fixture.cad_image} width="100%" style={{"maxWidth":"400px"}} />
    </>}
    {fixture.lateral_image && <>
      <label><b>Lateral Image</b></label>
      <img src={fixture.lateral_image} width="100%" style={{"maxWidth":"400px"}} />
    </>}
    </Stack>
  )
}