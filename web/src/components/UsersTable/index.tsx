import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { TableContainer, Table, Paper } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import UsersTableHead from './UsersTableHead';
import UsersTableBody from './UsersTableBody';
import UsersTablePagination from './UsersTablePagination';
import { getUsers, UserResponse } from 'adapters/users';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: `${theme.spacing(2)}px ${theme.spacing(4)}px`
    },
    table: {
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
    <Paper className={classes.root} variant="outlined">
      <TableContainer>
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
