export type ConfirmModalState = {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};