import { TableBody, TableRow, TableCell } from '@material-ui/core';
import { UserResponse } from 'adapters/users';
import UsersTableRow from './UsersTableRow';

export interface UsersTableBodyProps {
  count: number,
  page: number;
  rowsPerPage: number;
  currentPageUsers: UserResponse[];
  onEditUser: (user: UserResponse) => void;
  onDeleteUser: (user: UserResponse) => void;
}

export default function UsersTableBody(props: UsersTableBodyProps) {
  const { count, page, rowsPerPage, currentPageUsers, onEditUser, onDeleteUser } = props;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  return (
    <TableBody>
      {currentPageUsers.map(user => (
        <UsersTableRow
          key={user.userId}
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser} />
      ))}
      {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={8} />
        </TableRow>
      )}
    </TableBody>
  );
}