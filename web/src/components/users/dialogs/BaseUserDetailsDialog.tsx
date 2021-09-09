import { FormEvent, ReactNode, useContext, useState, useEffect } from 'react';
import { Dialog, DialogContent, Grid, TextField, Button, DialogTitle, Typography, IconButton } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Close as CloseIcon } from '@material-ui/icons';
import { isUserErrorResponse, UserResponse, UserPost, UserErrorResponse, UnknownUserErrorResponse, UUID } from 'adapters/users';
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

interface BaseUserDialogDetailsTitleProps {
    id: string;
    children: ReactNode;
    onClose: () => void;
}

function BaseUserDetailsDialogTitle(props: BaseUserDialogDetailsTitleProps) {
    const { id, children, onClose } = props;
    const classes = useStyles();

    return (
        <DialogTitle
            id={id}
            className={classes.root}
            disableTypography
        >
            <Typography variant="h6">
                {children}
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

export type UserDetailsFormState = Required<UserPost>;

export interface BaseUserDetailsDialogProps {
    title: string;
    user?: UserResponse;
    open: boolean;
    onClose: () => void;
    onSubmit: (formState: UserDetailsFormState, userId?: UUID) => Promise<UserErrorResponse | UnknownUserErrorResponse | null>;
}

const initialFormState: UserDetailsFormState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
};

export default function BaseUserDetailsDialog(props: BaseUserDetailsDialogProps) {
    const context = useContext(AppContext) ?? throwAppContextUndefined();
    const { title, user, open, onClose, onSubmit } = props;
    const [formState, setFormState] = useState(initialFormState);
    const [errorCause, setErrorCause] = useState('');

    useEffect(() => {
        if (open && user) {
            const updatedFormState = {
                ...user,
                phone: user.phone ?? ''
            };
            setFormState(updatedFormState);
        }
    }, [open, user]);

    const appendFormState = (formProps: Partial<UserDetailsFormState>) => setFormState({
        ...formState,
        ...formProps
    });

    const handleClose = () => {
        onClose();
        setFormState(initialFormState);
        setErrorCause('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await onSubmit(formState, user?.userId);

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
        <Dialog
            open={open}
            aria-labelledby="create-user-dialog-title"
        >
            <BaseUserDetailsDialogTitle
                id="create-user-dialog-title"
                onClose={handleClose}
            >
                {title}
            </BaseUserDetailsDialogTitle>
            <DialogContent dividers>
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    spellCheck="false"
                >
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
                                type="tel"
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
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}
