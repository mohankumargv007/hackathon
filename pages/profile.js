import * as React from 'react';
import Layout from '../components/layout';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import UserProfile from '../components/profile';


export async function getServerSideProps({ req, res }) {
    // Fetch data from external API
    const supabase = createServerSupabaseClient({ req, res });

    let { data: stores } = await supabase
        .from('stores')
        .select('store_id')
        .eq('status', true)

    let { data: session} = await supabase.auth.getSession()
    let { data: profile } = await supabase
        .from('profile')
        .select('id, first_name, last_name, store_id','concept')
        .single()
    return { props: { stores: stores, session, profile: profile } };
}

export default function Profile(props) {
    return (
        <Layout title="User Profile" {...props}><UserProfile {...props} /></Layout>
    )
}