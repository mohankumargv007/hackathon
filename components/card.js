import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MuiCard(props) {
  return (
    <Link href={props.href} passHref legacyBehavior>
      <Card>
        <div style={{height:'200px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img
          style={{height:'100%'}}
          src={props.cad_image || props.front_image || props.lateral_image}
          title={props.name}
        />
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {props.type}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Details</Button>
        </CardActions>
      </Card>
    </Link>
  )
}