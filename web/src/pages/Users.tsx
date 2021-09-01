import { Typography, Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import UsersTable from 'components/UsersTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        titleContainer: {
            display: 'flex',
            flexFlow: 'row wrap',
            margin: `${theme.spacing(3)}px ${theme.spacing(4)}px`
        },
        title: {
            flex: '1 0'
        },
        titleButton: {
            flex: '0 0',
            whiteSpace: 'nowrap',
            minWidth: 'max-content'
        }
    })
);

export default function Users() {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.titleContainer}>
                <Typography className={classes.title} variant="h4">
                    Users
                </Typography>
                <Button className={classes.titleButton} variant="outlined">
                    create User
                </Button>
            </div>
            <UsersTable />
        </div>
    );
}
