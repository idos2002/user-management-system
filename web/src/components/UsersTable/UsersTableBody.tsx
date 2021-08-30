import { TableBody, TableRow, TableCell } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { UserResponse } from 'adapters/users';
import { format as formatDate } from 'date-fns';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      whiteSpace: 'nowrap',
    },
    uuid: {
      maxWidth: '15ch',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
);

export interface UsersTableBodyProps {
  count: number,
  page: number;
  rowsPerPage: number;
  currentPageUsers: UserResponse[];
}

export default function UsersTableBody(props: UsersTableBodyProps) {
  const classes = useStyles();
  const { count, page, rowsPerPage, currentPageUsers } = props;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  return (
    <TableBody className={classes.root}>
      {currentPageUsers.map(user => (
        <TableRow key={user.userId}>
          <TableCell className={classes.uuid}>{user.userId}</TableCell>
          <TableCell>{user.username}</TableCell>
          <TableCell>{user.firstName}</TableCell>
          <TableCell>{user.lastName}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.phone}</TableCell>
          <TableCell>{formatDate(user.created, 'yyyy-MM-dd, HH:mm:ss')}</TableCell>
          <TableCell>{formatDate(user.modified, 'yyyy-MM-dd, HH:mm:ss')}</TableCell>
        </TableRow>
      ))}
      {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={8} />
        </TableRow>
      )}
    </TableBody>
  );
}