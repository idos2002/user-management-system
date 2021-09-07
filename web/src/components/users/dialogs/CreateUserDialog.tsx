import { FormEvent, useContext, useState } from 'react';
import { Dialog, DialogContent, Grid, TextField, Button, DialogTitle, Typography, IconButton } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Close as CloseIcon } from '@material-ui/icons';
import { postUser, isUserErrorResponse, UserPost } from 'adapters/users';
import { AppContext, throwAppContextUndefined } from 'contexts/AppContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2)
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1)
        }
    })
);

interface CreateUserDialogTitleProps {
    id: string;
    onClose: () => void;
}

function CreateUserDialogTitle(props: CreateUserDialogTitleProps) {
    const { id, onClose } = props;
    const classes = useStyles();

    return (
        <DialogTitle
            id={id}
            className={classes.root}
            disableTypography
        >
            <Typography variant="h6">
                Create User
            </Typography>
            <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={onClose}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
}

export interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

const initialFormState: UserPost = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
};

export default function CreateUserDialog(props: CreateUserDialogProps) {
    const context = useContext(AppContext) ?? throwAppContextUndefined();
    const { open, onClose } = props;
    const [formState, setFormState] = useState(initialFormState);
    const [errorCause, setErrorCause] = useState('');

    const appendFormState = (formProps: Partial<UserPost>) => setFormState({
        ...formState,
        ...formProps
    });

    const handleClose = () => {
        onClose();
        setFormState(initialFormState);
        setErrorCause('');
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await postUser({
            ...formState,
            phone: formState.phone || undefined
        });

        if (response === null) { // user was posted
            // close dialog and refresh app
            handleClose();
            context.setLastRefresh(new Date());
        } else if (isUserErrorResponse(response)) {
            if (response.details) {
                const [cause] = response.details.cause ?? ['']
                setErrorCause(cause);
            } else {
                console.log(`${response.error}: ${response.message}`);
            }
        } else { // unknwon user error response
            console.log('Some error occured submitting the form.')
        }
    };

    return (
        <Dialog open={open} aria-labelledby="create-user-dialog-title">
            <CreateUserDialogTitle id="create-user-dialog-title" onClose={handleClose} />
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Grid container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                value={formState.username}
                                onChange={e => appendFormState({ username: e.target.value })}
                                required
                                autoFocus
                                error={errorCause === 'username'}
                                helperText={errorCause === 'username'
                                    ? "This username is already used"
                                    : undefined}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="firstName"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                value={formState.firstName}
                                onChange={e => appendFormState({ firstName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="lastName"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                value={formState.lastName}
                                onChange={e => appendFormState({ lastName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={formState.email}
                                onChange={e => appendFormState({ email: e.target.value })}
                                required
                                error={errorCause === 'email'}
                                helperText={errorCause === 'email'
                                    ? "This email address is already used"
                                    : undefined}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="phone"
                                label="Phone"
                                variant="outlined"
                                fullWidth
                                value={formState.phone}
                                onChange={e => appendFormState({ phone: e.target.value })}
                                error={errorCause === 'phone'}
                                helperText={errorCause === 'phone'
                                    ? "This phone number is already used"
                                    : undefined}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                color="primary"
                                disableElevation
                            >
                                Create User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}
