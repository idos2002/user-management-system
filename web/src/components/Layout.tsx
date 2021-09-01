import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolBar: {
            display: 'flex',
            flexFlow: 'row nowrap'
        },
        toolBarTitle: {
            flexGrow: 1
        },
        page: {
            width: '100%'
        },
        appBarSpacer: theme.mixins.toolbar
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
                <Toolbar className={classes.toolBar}>
                    <Typography className={classes.toolBarTitle} variant="h6">
                        User Management System
                    </Typography>
                    <Tooltip title="Refresh">
                        <IconButton color="inherit">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <div className={classes.appBarSpacer} />
            <div className={classes.page}>
                {children}
            </div>
        </div>
    );
}