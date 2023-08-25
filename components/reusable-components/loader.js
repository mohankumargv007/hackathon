import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../../styles/admin/Layout.module.css';

export default function Loading(props) {
    return <CircularProgress disableShrink className={styles.loader}/>
}