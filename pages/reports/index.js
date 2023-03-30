import _get from 'lodash/get';
import Box from '@mui/material/Box';
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from "recharts";

export default function Fixture(props) {
  return (
    <Box paddingX="20px" paddingY="40px">
      <BarChart
        width={500}
        height={500}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Arms&Hooks&Bars" stackId="a" fill="#8884d8" />
        <Bar dataKey="Rails&Stands" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Shelves&Bins" stackId="a" fill="#82fa9d" />
        <Bar dataKey="Tables" stackId="a" fill="#82fa9d" />
      </BarChart>
    </Box>
  )
}

const data = [
  {
    "Group": "Footwear",
    "Arms&Hooks&Bars": 2295,
    "Rails&Stands": "",
    "Shelves&Bins": 58,
    "Tables": ""
  },
  {
    "Group": "Accessories",
    "Arms&Hooks&Bars": 1409,
    "Rails&Stands": "",
    "Shelves&Bins": 22,
    "Tables": ""
  },
  {
    "Group": "Lingerie & Sleepwear",
    "Arms&Hooks&Bars": 728,
    "Rails&Stands": 30,
    "Shelves&Bins": "",
    "Tables": 5
  },
  {
    "Group": "Children",
    "Arms&Hooks&Bars": 497,
    "Rails&Stands": 85,
    "Shelves&Bins": 6,
    "Tables": 10
  },
  {
    "Group": "Men",
    "Arms&Hooks&Bars": 248,
    "Rails&Stands": 99,
    "Shelves&Bins": 55,
    "Tables": 9
  },
  {
    "Group": "Toys & Luggage",
    "Arms&Hooks&Bars": 294,
    "Rails&Stands": "",
    "Shelves&Bins": 55,
    "Tables": ""
  },
  {
    "Group": "Women",
    "Arms&Hooks&Bars": 200,
    "Rails&Stands": 120,
    "Shelves&Bins": 15,
    "Tables": 11
  },
  {
    "Group": "Home",
    "Arms&Hooks&Bars": 28,
    "Rails&Stands": "",
    "Shelves&Bins": 111,
    "Tables": 3
  },
  {
    "Group": "Basics Non Apparels",
    "Arms&Hooks&Bars": "",
    "Rails&Stands": 6,
    "Shelves&Bins": "",
    "Tables": ""
  },
  {
    "Group": "Toys Boys & Girls",
    "Arms&Hooks&Bars": "",
    "Rails&Stands": 2,
    "Shelves&Bins": "",
    "Tables": ""
  },
  {
    "Group": "SM-Accessories",
    "Arms&Hooks&Bars": "",
    "Rails&Stands": 1,
    "Shelves&Bins": "",
    "Tables": ""
  }
];