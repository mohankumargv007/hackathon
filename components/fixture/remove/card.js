import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MuiCard(props) {
  return (
    <Link href={`/fixture/remove/fid/${props.id}`} passHref legacyBehavior>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={props.front_image}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.type}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Details</Button>
        </CardActions>
      </Card>
    </Link>
  )
}