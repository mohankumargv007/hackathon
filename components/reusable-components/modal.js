import React, { useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import styles from '../../styles/admin/Layout.module.css';
import TextField from '@mui/material/TextField';
import { Grid, Input } from "@mui/material";
import { supabaseConnection } from '../../utils/supabase';
import ImageListItem from '@mui/material/ImageListItem';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function Modal(props) {
    const [open, setOpen] = React.useState(true);
    const record = {
        concept_code            : "",
        type                    : "",
        name                    : "",
        component_name          : "",
        component_count         : "",
        key                     : "",
        component_code          : "",
        components              : "",
        cad_image               : "",
        front_image             : "",
        lateral_image           : "",
        component_length        : "",
        component_width         : "",
        component_height        : "",
        status                  : true
    };

    const [formData, setFormData] = React.useState(record);
    //const [formData, setFormData] = React.useState([]);

    /* if(props.hasOwnProperty('rowData') && props.rowData.hasOwnProperty('id') ) {
        setFormData( () => {  return [...formData, 
                Object.keys(props.rowData).forEach((key, val) => {
                    props.rowData[key]
                })
            ]
        });
    } else {
        const [formData, setFormData] = React.useState(record);
    } */

    /* const [formData, setFormData] = React.useState([]);
    useEffect(() => {
        createArray();
    }, [record]);

    const createArray = () => {
        debugger;
        setFormData( () => {  return [...formData, record.map((item) => item.name)] });
    }; */


    const formFields = [
        {
            'fieldName'     : 'concept_code',
            'type'          : 'number',
            'label'         : 'Concept Code',
            'helper_text'   : 'Please enter concept code',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'type',
            'type'          : 'text',
            'label'         : 'Fixture Type',
            'helper_text'   : 'Please enter fixture type',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'name',
            'type'          : 'text',
            'label'         : 'Fixture Name',
            'helper_text'   : 'Please enter fixture name',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_name',
            'type'          : 'text',
            'label'         : 'Component Name',
            'helper_text'   : 'Please enter component name',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_count',
            'type'          : 'number',
            'label'         : 'Component Count',
            'helper_text'   : 'Please enter component count',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'key',
            'type'          : 'number',
            'label'         : 'Key',
            'helper_text'   : 'Please enter fixture key',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_code',
            'type'          : 'text',
            'label'         : 'Component Code',
            'helper_text'   : 'Please enter component code',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'components',
            'type'          : 'number',
            'label'         : 'No.of Components',
            'helper_text'   : 'Please enter no.of component',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_length',
            'type'          : 'number',
            'label'         : 'Component Length',
            'helper_text'   : 'Please enter component length',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_width',
            'type'          : 'number',
            'label'         : 'Component Width',
            'helper_text'   : 'Please enter component width',
            'is_valid'      : false,
        },
        {
            'fieldName'     : 'component_height',
            'type'          : 'number',
            'label'         : 'Component Height',
            'helper_text'   : 'Please enter component height',
            'is_valid'      : false,
        }
    ];

    const imageFields = [
        {
            'fieldName' : 'cad_image',
            'type'      : 'image',
            'label'     : 'Cad Image'
        },
        {
            'fieldName' : 'front_image',
            'type'      : 'image',
            'label'     : 'Front Image'
        },
        {
            'fieldName' : 'lateral_image',
            'type'      : 'image',
            'label'     : 'Lateral Image'
        }
    ];

    //Storage Bucket
    const bucket = props.storage;

    //Storage URL
    const storage_url = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        props.handleClose(false);
    };

    const clickFileEvent = () => {
        inputFileRef.current.click();
    }
  
    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        

        setFormData((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue
        }));
    }

    //Insert Fixture Library
    async function saveFixtureInformation(e) {
        e.preventDefault();
        try {
            const supabase = supabaseConnection();
            let { error } = await supabase.from('fixture_library').insert([formData])
            if (error) throw error
            alert('Fixture Created!');
            handleClose();
        } catch (error) {
            alert('Error Creating Fixture!')
            console.log(error)
        } finally {
            console.log(121)
        }
    }

    //Upload File To Supabase Storage
    async function uploadFileToStorage(type, e, edit) {
        const imageFile = e.target.files;

        if(imageFile.length <= 0) {
            alert('Please select an image.');
            return false;
        }

        if(edit) {
            deleteUploadedImage(type);
        }

        try {
            //Type Of Image
            const type_of_image = type.field.fieldName;

            //File Name = Type Of Image + Current Timestamp + _ + Upload Image Name From Browser
            const fileName  = type.field.fieldName+'/'+Date.now()+'_'+imageFile[0].name;
        
            //Supabase Connection
            const supabase  = supabaseConnection();

            //Uload Image To Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, imageFile[0]);

            //Get Public URL From File Name
            const { image } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)


            const PUBLIC_IMAGE_URL = storage_url+bucket+'/'+data.path;

            //Set Image URL For Data Saving
            setFormData((prevState) => ({
                ...prevState,
                [type_of_image]: PUBLIC_IMAGE_URL
            }));
        } catch (error) {
            alert('Error Uploading Image')
            console.log(error)
        } finally {
            console.log(2121);
        }
    } 
    
    //Delete Uploaded Image
    async function deleteUploadedImage(type) {
        try {
            //Type Of Image
            const type_of_image = type.field.fieldName;
            
            let stroage_path = storage_url+bucket+'/';
            let fileName = formData[type_of_image].split(stroage_path)[1];

            //Supabase Connection
            const supabase  = supabaseConnection();

            const { data, error } = await supabase.storage
                .from(bucket)
                .remove([fileName])

            //Set Image URL For Data Saving
            setFormData((prevState) => ({
                ...prevState,
                [type_of_image]: ""
            }));
        } catch (error) {

        }
    }

    const isUrlValid = (field) => {
        debugger;
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                className={styles.stylesModal}
            >
                <form onSubmit={saveFixtureInformation}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {props.form_name}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={saveFixtureInformation}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className={styles.innderModalPadd}>
                    {/* Form Fileds */}
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="left"
                    alignItems="left"
                    >
                        {formFields.map((field, index) => (
                            <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                                <TextField
                                fullWidth 
                                label={field.label}
                                id="outlined-size-small"
                                name={field.fieldName}
                                type={field.type}
                                onChange={handleInput}
                                size="small"
                                margin="dense"
                                variant="standard"
                                required
                                /* error={field.is_valid == false ? field.helper_text : ''}
                                helperText={field.is_valid == false ? field.helper_text : ''} */
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {/* Image Uploads */}
                    <div mt={10}>
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    >
                        {imageFields.map((field, index) => (
                            <Grid item lg={2} md={3} sm={12} xs={12} textAlign="center">
                                <div style={{marginTop:"10%"}}>
                                        {
                                        formData[field.fieldName] == '' ?
                                            <Button variant="contained" component="label" endIcon={<FileUploadIcon />} sx={{width : "100%"}}>
                                                {field.fieldName}
                                                <input hidden 
                                                    accept="image/*" 
                                                    type="file" 
                                                    label={field.label}
                                                    id="outlined-size-small"
                                                    name={field.fieldName}
                                                    onChange={(e) => 
                                                        uploadFileToStorage({field}, e)
                                                    }
                                                    size="small"
                                                    margin="dense"
                                                />
                                            </Button> : ''
                                        }   
                                    
                                </div>
                                <div>
                                    {
                                        formData[field.fieldName] != '' ?
                                        (
                                            <div>
                                                <ImageListItem>
                                                    <img
                                                        src={`${formData[field.fieldName]}?w=248&fit=crop&auto=format`}
                                                        srcSet={`${formData[field.fieldName]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                                <div mt={10}>
                                                    <ButtonGroup size="medium">
                                                        <Button variant="contained" component="label" endIcon={<EditIcon />} sx={{width : "100"}}>
                                                            <input hidden 
                                                                accept="image/*" 
                                                                type="file" 
                                                                label={field.label}
                                                                id="outlined-size-small"
                                                                name={field.fieldName}
                                                                onChange={(e) => 
                                                                    uploadFileToStorage({field}, e, true)
                                                                }
                                                                size="small"
                                                                margin="dense"
                                                            />
                                                        </Button>
                                                        <Button color='error' variant="contained" component="label" endIcon={<DeleteIcon />} sx={{width : "100"}}
                                                            onClick={(e) => 
                                                                deleteUploadedImage({field})
                                                            }
                                                        >    
                                                            
                                                        </Button>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                        )
                                        
                                        : ''
                                    }
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    </div>
                </div>
                </form>
            </Dialog>
        </div>
    );
}