import { supabaseConnection } from '../../../../utils/supabase';

//Create And Upload Fixture Library
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const supabase = supabaseConnection();
        const formData = JSON.parse(req.body);
        try {
            const { data, error } = [];
            if(formData.hasOwnProperty('id')) {
                const { data, error } = await supabase
                                                .from('fixture_library')
                                                .update(formData)
                                                .eq('id', formData.id)
                res.status(200).json({data: formData, error: error});
            } else {
                const { data, error } = await supabase.from('fixture_library').insert([formData])
                res.status(200).json({data: formData, error: error});
            }
        } catch(error) {
            console.log(error);
            res.status(500).send();
        }
    } else {
        // Handle any other HTTP method
        res.status(405).send({ message: 'Only POST requests allowed' })
    }
}