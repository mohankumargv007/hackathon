import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Grid } from "@mui/material";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabaseConnection } from '../../utils/supabase';
import commonStyles from '../../styles/Common.module.css';


export default function Inward() {
    const handleChange = (event) => {
    }
    //Open Model
    const handleClickOpen = (e) => {
    };

    const [concept, setConcept] = React.useState("");


    if (typeof window !== 'undefined') {
        // Perform localStorage action
        const concept = localStorage.getItem('user_concept')
        //setConcept(concept);
      }



    const cards = [
        {
            'label': 'Total Products',
            'value': 0,
            'key': 'total'
        },
        {
            'label': 'Pending In Shoot',
            'value': 0,
            'key': 'pending'
        },
        {
            'label': 'Shoot Done',
            'value': 0,
            'key': 'shot'
        },
        {
            'label': 'Dropped By Studio',
            'value': 0,
            'key': 'drop'
        },
        {
            'label': 'On-Hold By Studio',
            'value': 0,
            'key': 'hold'
        },
        {
            'label': 'Reshoot',
            'value': 0,
            'key': 'reshoot'
        },
        {
            'label': 'Rejected',
            'value': 0,
            'key': 'reject'
        }
    ];

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const data_count = {
        "total": 0,
        "pending": 0,
        "shot": 0,
        "hold": 0,
        "drop": 0,
        "reshoot": 0,
        "reject": 0,
    }

    const [dataCount, setDataCount] = React.useState(data_count);

    getData(dataCount);

    async function getData(dataCount) {
        const supabase = supabaseConnection();
        let { data, error } = await supabase
            .from('products')
            .select('*');
        
            dataCount.target = data.length;
        
        const counts = {
            "total": data.length,
            "pending": 0,
            "shot": 0,
            "hold": 0,
            "drop": 0,
            "reshoot": 0,
            "reject": 0,
        }

        for(var i=0; i < data.length; i++) {
            if(data[i].status == 'shot') {
                counts['shot'] = counts['shot'] + 1;
            }

            if(data[i].status == 'pending') {
                counts['pending'] = counts['pending'] + 1;
            }

            if(data[i].status == 'hold') {
                counts['hold'] = counts['hold'] + 1;
            }

            if(data[i].status == 'reject') {
                counts['reject'] = counts['reject'] + 1;
            }

            if(data[i].status == 'reshoot') {
                counts['reshoot'] = counts['reshoot'] + 1;
            }

            if(data[i].status == 'drop') {
                counts['drop'] = counts['drop'] + 1;
            }
        }

        setDataCount(counts);
    }

    return (
        <div>
            <h1 className={commonStyles.conceptStyle}>Max</h1>
            <Grid container spacing={2}
                direction="row"
                alignItems="center"
                sx={{ margin: "0px", width: "100%" }}
            >
                {cards.map((card, index) => (
                    <Grid item lg={3} md={3} sm={12} xs={12} sx={{ padding: "16px" }}>
                        <Card>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: "center" }}>
                                        {card.label}
                                    </Typography>
                                    <Typography variant="h2" color="text.secondary" sx={{ textAlign: "center" }}>
                                        {dataCount[card.key]}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}