import { ReactNode, useContext } from 'react';
import { AppBar, Toolbar, Typography, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import { AppContext, throwAppContextUndefined } from 'contexts/AppContext';

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
            width: '100%',
            height: '100%'
        },
        appBarSpacer: theme.mixins.toolbar
    })
);

export interface LayoutProps {
    children?: ReactNode
}

export default function Layout(props: LayoutProps) {
    const { children } = props;
    const classes = useStyles();
    const { setLastRefresh } = useContext(AppContext) ?? throwAppContextUndefined();

    const handleRefresh = () => setLastRefresh(new Date());

    return (
        <div>
            <AppBar>
                <Toolbar className={classes.toolBar}>
                    <Typography className={classes.toolBarTitle} variant="h6">
                        User Management System
                    </Typography>
                    <Tooltip title="Refresh">
                        <IconButton color="inherit" onClick={handleRefresh}>
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