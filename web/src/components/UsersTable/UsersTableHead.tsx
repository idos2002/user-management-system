import { TableHead, TableRow, TableCell } from '@material-ui/core';
import { UserResponse } from 'adapters/users';

interface HeadCell {
  key: keyof UserResponse;
  label: string;
}

const headCells: HeadCell[] = [
  { key: 'userId', label: 'UUID' },
  { key: 'username', label: 'Username' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'created', label: 'Created' },
  { key: 'modified', label: 'Last Update' },
];

export default function UsersTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.key}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}