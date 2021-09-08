import { updateUser, UserResponse, UUID, UnknownUserErrorResponse } from 'adapters/users';
import BaseUserDetailsDialog, { UserDetailsFormState } from './BaseUserDetailsDialog';


export interface EditUserDialogProps {
  user: UserResponse | undefined;
  open: boolean;
  onClose: () => void;
}

export default function EditUserDialog(props: EditUserDialogProps) {
  const { user, open, onClose } = props;

  const handleSubmit = async (formState: UserDetailsFormState, userId?: UUID) => {
    if (!userId) {
      return {} as UnknownUserErrorResponse;
    }

    return await updateUser(userId, {
      ...formState,
      phone: formState.phone || undefined
    });
  };

  return (
    <BaseUserDetailsDialog
      title="Edit User"
      open={open}
      user={user}
      onClose={onClose}
      onSubmit={handleSubmit} />
  );
}
