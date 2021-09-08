import { postUser } from 'adapters/users';
import BaseUserDetailsDialog, { UserDetailsFormState } from './BaseUserDetailsDialog';

export interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateUserDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const handleSubmit = (formState: UserDetailsFormState) => {
        return postUser({
            ...formState,
            phone: formState.phone || undefined
        });
    };

    return (
        <BaseUserDetailsDialog
            title="Create User"
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit} />
    );
}
