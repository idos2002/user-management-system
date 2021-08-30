import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { TableContainer, Table, Paper } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import UsersTableHead from './UsersTableHead';
import UsersTableBody from './UsersTableBody';
import UsersTablePagination from './UsersTablePagination';
import { getUsers, UserResponse } from 'adapters/users';

const rows: UserResponse[] = [
  {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    username: 'johndoe123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+972521234567',
    created: new Date(),
    modified: new Date()
  },
  {
    userId: '123e4567-e89b-12d3-a852-426614174000',
    username: 'janedoe123',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+972531234567',
    created: new Date(),
    modified: new Date()
  }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    container: {
      maxHeight: 400
    },
    table: {
      minWidth: 750,
      whiteSpace: 'nowrap'
    },
  })
);

const rowsPerPageOptions: number[] = [5, 10, 15, 20, 25];

export default function UsersTable() {
  const classes = useStyles();
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [currentPageUsers, setCurrentPageUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUsers(page, rowsPerPage, new Date()); // FIXME Save state of last date before refresh or table
      setTotalCount(response.totalCount);
      setCurrentPageUsers(response.users)
    }

    fetchData();
  }, [page, rowsPerPage])

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null, newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table className={classes.table} stickyHeader aria-label="Users Table">
          <UsersTableHead />
          <UsersTableBody
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            currentPageUsers={currentPageUsers}
          />
        </Table>
      </TableContainer>
      <UsersTablePagination
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
