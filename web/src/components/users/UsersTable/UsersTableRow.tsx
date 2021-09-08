import { useState, MouseEvent } from 'react';
import { TableRow, TableCell, IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import { format as formatDate } from 'date-fns';
import { UserResponse } from 'adapters/users';

const useStyles = makeStyles(() =>
    createStyles({
        uuid: {
            maxWidth: '15ch',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    })
);

export interface UsersTableRowProps {
    user: UserResponse;
    onEdit: (user: UserResponse) => void;
    onDelete: (user: UserResponse) => void;
}

export default function UsersTableRow(props: UsersTableRowProps) {
    const { user, onEdit, onDelete } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpenActionsMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseActionsMenu = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleCloseActionsMenu();
        onEdit(user);
    };

    const handleDelete = () => {
        handleCloseActionsMenu();
        onDelete(user);
    };

    return (
        <TableRow>
            <TableCell className={classes.uuid}>{user.userId}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{formatDate(user.created, 'yyyy-MM-dd, HH:mm:ss')}</TableCell>
            <TableCell>{formatDate(user.modified, 'yyyy-MM-dd, HH:mm:ss')}</TableCell>
            <TableCell padding="none" align="right">
                <IconButton
                    aria-label="More Actions"
                    aria-controls="user-actions-menu"
                    aria-haspopup="true"
                    onClick={handleOpenActionsMenu}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="user-actions-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseActionsMenu}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}