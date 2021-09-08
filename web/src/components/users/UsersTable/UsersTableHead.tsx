import { TableHead, TableRow, TableCell } from '@material-ui/core';
import { UserResponse } from 'adapters/users';

export interface HeadCell {
  key: keyof UserResponse | 'userActionsMenu';
  label: string;
}

export interface UsersTableHeadProps {
  headCells: HeadCell[];
}

export default function UsersTableHead(props: UsersTableHeadProps) {
  const { headCells } = props;

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