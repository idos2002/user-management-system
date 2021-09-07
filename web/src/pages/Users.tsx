import { useState } from 'react';
import { Typography, Button, Box } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CreateUserDialog from 'components/users/dialogs/CreateUserDialog';
import UsersTable from 'components/users/UsersTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flex: '1 0'
        },
        headerButton: {
            flex: '0 0',
            whiteSpace: 'nowrap',
            minWidth: 'max-content'
        }
    })
);

export default function Users() {
    const classes = useStyles();
    const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

    return (
        <Box m={4} display="flex" flexDirection="column">
            <Box mb={2} display="flex" flexDirection="row">
                <Typography className={classes.title} variant="h4">
                    Users
                </Typography>
                <Button
                    className={classes.headerButton}
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenCreateUserDialog(true)}
                >
                    Create User
                </Button>
                <CreateUserDialog
                    open={openCreateUserDialog}
                    onClose={() => setOpenCreateUserDialog(false)}
                />
            </Box>
            <UsersTable />
        </Box>
    );
}
