"use client";

import React, {createContext, ReactNode, useContext, useState} from "react";
import {AlertDialog, Button} from "@heroui/react";

type AlertDialogIconProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Icon>;
type AlertDialogContainerProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Container>;
type AlertDialogBackdropProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Backdrop>;

interface AlertDialogOptions {
    title: ReactNode;
    body: ReactNode;
    status?: AlertDialogIconProps["status"];
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    isDismissable?: AlertDialogBackdropProps["isDismissable"];
    size?: AlertDialogContainerProps["size"];
}

interface AlertDialogContextType {
    show: (options: AlertDialogOptions) => void;
    close: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export function AlertDialogProvider({children}: { children: ReactNode }) {
    const [options, setOptions] = useState<AlertDialogOptions | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const show = (newOptions: AlertDialogOptions) => {
        setOptions(newOptions);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setOptions(null);
        setLoading(false);
    };

    const handleConfirm = async () => {
        if (options?.onConfirm) {
            setLoading(true);
            try {
                await options.onConfirm();
                close();
            } catch (error) {
                console.error("AlertDialog confirmation error:", error);
                setLoading(false);
            }
        } else {
            close();
        }
    };

    const handleCancel = () => {
        options?.onCancel?.();
        close();
    };

    return (<AlertDialogContext.Provider value={{show, close}}>
        {children}
        <AlertDialog.Backdrop
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            isDismissable={options?.isDismissable ?? false}
        >
            <AlertDialog.Container placement='center' size={options?.size ?? "sm"}>
                <AlertDialog.Dialog>
                    <AlertDialog.CloseTrigger/>
                    <AlertDialog.Header>
                        <AlertDialog.Icon status={options?.status ?? "danger"}/>
                        <AlertDialog.Heading>{options?.title}</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                        {typeof options?.body === "string" ? <p>{options.body}</p> : options?.body}
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="tertiary" onPress={handleCancel} isDisabled={loading}>
                            {options?.cancelLabel ?? "Cancel"}
                        </Button>
                        <Button
                            variant={options?.status === "danger" ? "danger" : "primary"}
                            onPress={handleConfirm}
                            isPending={loading}
                        >
                            {options?.confirmLabel ?? "Confirm"}
                        </Button>
                    </AlertDialog.Footer>
                </AlertDialog.Dialog>
            </AlertDialog.Container>
        </AlertDialog.Backdrop>
    </AlertDialogContext.Provider>);
}

export function useAlertDialog() {
    const context = useContext(AlertDialogContext);
    if (!context) {
        throw new Error("useAlertDialog must be used within an AlertDialogProvider");
    }
    return context;
}

// Singleton-like access for non-component usage if needed
let alertDialogInstance: AlertDialogContextType | null = null;

export const alertDialog = {
    show: (options: AlertDialogOptions) => {
        if (alertDialogInstance) {
            alertDialogInstance.show(options);
        } else {
            console.error("AlertDialogProvider not initialized");
        }
    }, close: () => {
        if (alertDialogInstance) {
            alertDialogInstance.close();
        }
    }
};

// Hook to register the instance
export function AlertDialogRegister() {
    const context = useAlertDialog();
    React.useEffect(() => {
        alertDialogInstance = context;
    }, [context]);
    return null;
}
