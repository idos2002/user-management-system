import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        page: {
            width: '100%'
        },
        appBarSpacer: theme.mixins.toolbar,
        title: {
            margin: `${theme.spacing(2)}px ${theme.spacing(4)}px`
        }
    })
);

export interface LayoutProps {
    children?: ReactNode
}

export default function Layout(props: LayoutProps) {
    const classes = useStyles();
    const { children } = props;

    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography>
                        User Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.appBarSpacer} />
            <div className={classes.page}>
                <Typography className={classes.title} variant="h4">
                    Users
                </Typography>
                {children}
            </div>
        </div>
    );
}