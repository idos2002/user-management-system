import { useContext } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { AppContext } from 'contexts/AppContext';
import { deleteUser, UserResponse } from 'adapters/users';


export interface DeleteUserDialogProps {
  user: UserResponse | undefined;
  open: boolean;
  onClose: () => void;
}

export default function DeleteUserDialog(props: DeleteUserDialogProps) {
  const context = useContext(AppContext);
  const { user, open, onClose } = props;

  const handleDelete = async () => {
    if (user) {
      const deleted = await deleteUser(user.userId);

      if (deleted) {
        context?.setLastRefresh(new Date());
      } else {
        console.log(`A problem occured trying to delete user with UUID: ${user.userId}`);
      }
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-user-dialog-title"
      aria-describedby="delete-user-dialog-description"
    >
      <DialogTitle id="delete-user-dialog-title">
        Delete User
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-user-dialog-description">
          Are you sure you want to delete the user <strong>{user?.username}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
