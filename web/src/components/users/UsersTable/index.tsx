import { useState, useEffect, MouseEvent, ChangeEvent, useContext } from 'react';
import { TableContainer, Table, Paper } from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import UsersTableHead, { HeadCell } from './UsersTableHead';
import UsersTableBody from './UsersTableBody';
import UsersTablePagination from './UsersTablePagination';
import { getUsers, UserResponse } from 'adapters/users';
import { AppContext, throwAppContextUndefined } from 'contexts/AppContext';
import EditUserDialog from '../dialogs/EditUserDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap'
    }
  })
);

const headCells: HeadCell[] = [
  { key: 'userId', label: 'UUID' },
  { key: 'username', label: 'Username' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'created', label: 'Created' },
  { key: 'modified', label: 'Last Update' },
  { key: "userActionsMenu", label: "" }
];

const rowsPerPageOptions: number[] = [5, 10, 15, 20, 25];

export default function UsersTable() {
  const classes = useStyles();
  const { lastRefresh } = useContext(AppContext) ?? throwAppContextUndefined();
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [currentPageUsers, setCurrentPageUsers] = useState<UserResponse[]>([]);
  const [currentlyEditedUser, setCurrentlyEditedUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUsers(page, rowsPerPage, lastRefresh);
      setTotalCount(response.totalCount);
      setCurrentPageUsers(response.users)
    }

    fetchData();
  }, [page, rowsPerPage, lastRefresh])

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

  const handleEditUser = (user: UserResponse) => {
    setCurrentlyEditedUser(user);
  };

  const handleDeleteUser = (user: UserResponse) => {
    
  };

  return (
    <div>
      <Paper variant="outlined">
        <TableContainer>
          <Table
            className={classes.table}
            aria-label="Users Table"
            stickyHeader
          >
            <UsersTableHead headCells={headCells} />
            <UsersTableBody
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              currentPageUsers={currentPageUsers}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
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
      <EditUserDialog
        open={Boolean(currentlyEditedUser)}
        user={currentlyEditedUser ?? undefined}
        onClose={() => setCurrentlyEditedUser(null)}
      />
    </div>
  );
}
