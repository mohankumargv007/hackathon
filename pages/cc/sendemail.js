import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';
import { Grid } from "@mui/material";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabaseConnection } from '../../utils/supabase';
import commonStyles from '../../styles/Common.module.css';

export default function SendEmail() {
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

    function sendMail() {
        alert("sending a mail")
    }

    const [dataCount, setDataCount] = React.useState(data_count);

   
    return (
        <div>
            <Button className={commonStyles.conceptStyleEmail} variant="contained" size="medium" onClick={sendMail}>
                    Send Email
                </Button>
        </div>
    )
}