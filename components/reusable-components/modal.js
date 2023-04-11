import React from 'react';
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
import { Alert, Grid, Input } from "@mui/material";
import { supabaseConnection } from '../../utils/supabase';
import ImageListItem from '@mui/material/ImageListItem';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../components/reusable-components/loader';
import commonStyles from '../../styles/Common.module.css';
import Notification from '../../components/reusable-components/alert'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide className={styles.stylesModal} direction="left" ref={ref} {...props} />;
});

export default function Modal(props) {
    const [open, setOpen] = React.useState(true);

    const [formData, setFormData] = React.useState(props.rowData);

    const [isLoading, setIsLoading] = React.useState(false);

    const [toastStatus, setToastStatus] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState("");

    const [toastType, setToastType] = React.useState("warning");

    const [state, setState] = React.useState({
        vertical        : 'top',
        horizontal      : 'center'
    });

    const { vertical, horizontal } = state;

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

    const handleClose = () => {
        setOpen(false);
        setIsLoading(false);
        props.handleClose(false);
    };
  
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
        setIsLoading(true);
        try {
            //From Validations
            const is_valid_data = validateFormFields();
            if(!is_valid_data) {
                notifyEvent(true, "warning", "All fields are required along with image uploads.");
                return false;
            }

            //Calculate Linear Meter Only For Fixture Library
            if(props.page == 'fixtures') {
                formData.linear_meter = formData.components * formData.component_length * 0.01
            }

            const supabase = supabaseConnection();

            let message = "";

            if(props.isUpdate) {
                let { error } = await supabase
                    .from('fixture_library')
                    .update(formData)
                    .eq('id', props.rowData.id)

                if (error) throw error
                message = 'Fixture Updated Successfully!';
            } else {
                let { error } = await supabase.from('fixture_library').insert([formData])
                if (error) throw error
                message = 'Fixture Created Successfully!';
            }
            //Sent Notification
            notifyEvent(true, "success", message);
            handleClose();
        } catch (error) {
            notifyEvent(true, 'error', 'Something went wrong.Please contact developer');
        } finally {
            setIsLoading(false);
        }
    }

    //Upload File To Supabase Storage
    async function uploadFileToStorage(type, e, edit) {
        setIsLoading(true);
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
            setIsLoading(false);
        } catch (error) {
            alert('Error Uploading Image')
            console.log(error)
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }
    
    //Delete Uploaded Image
    async function deleteUploadedImage(type) {
        setIsLoading(true);
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
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    //Validating Input Feilds
    const validateFormFields = () => {
        let result = true;
        Object.keys(formData).forEach((key, val) => {
            if(key != 'status' && formData[key] == '') {
                result = false;
            }
        })
        return result;
    };

    //Closing Message Prompt
    const handleCloseToast = () => {
        setToastStatus(false);
    }

    //Notification Event
    const notifyEvent = (propmtStatus, messageType, message) => {
        setToastStatus(propmtStatus);
        setToastType(messageType);
        setToastMessage(message)
        setIsLoading(false);
    }

    return (
        <div>
            {/* Loading Component */}
            {
                isLoading == true ? <Loading/> : ''
            }

            {/* Notification Component */}
            {
                toastStatus == true ?
                <Notification
                    state={state}
                    toastType={toastType}
                    toastMessage={toastMessage}
                    onClose={handleCloseToast}
                ></Notification> : ''
            }
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <form onSubmit={saveFixtureInformation}>
                <AppBar sx={{ position: 'relative' }} className={commonStyles.modelHeader}>
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
                            {props.formName}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={saveFixtureInformation} className={commonStyles.save}>
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
                            <Grid item lg={4} md={4} sm={12} xs={12} textAlign="center">
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
                                value={formData[field.fieldName]}
                                /* error={field.is_valid == false ? field.helper_text : ''}
                                helperText={field.is_valid == false ? field.helper_text : ''} */
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {/* Image Uploads */}
                    <div className={commonStyles.marginTop}>
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    >
                        {imageFields.map((field, index) => (
                            <Grid item lg={4} md={4} sm={12} xs={12} textAlign="center">
                                <div style={{marginTop:"10%"}}>
                                        {
                                        formData[field.fieldName] == '' ?
                                            <Button variant="contained" component="label" endIcon={<FileUploadIcon />} sx={{width : "100%"}}>
                                                {field.label}
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
                                                <span>{field.label}</span>
                                                <ImageListItem>
                                                    <img
                                                        src={`${formData[field.fieldName]}?w=248&fit=crop&auto=format`}
                                                        srcSet={`${formData[field.fieldName]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                                <div mt={10}>
                                                    <ButtonGroup size="medium">
                                                        <Button variant="contained" component="label" endIcon={<EditIcon className={styles.iconPadd} sx={{ marginLeft: '0 !important' }}/>} sx={{width : "100"}}>
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
                                                        <Button color='error' variant="contained" component="label" endIcon={<DeleteIcon className={styles.iconPadd}/>} sx={{width : "100"}}
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