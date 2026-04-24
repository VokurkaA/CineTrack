import {Button, FieldError, Form, Input, Label, Modal, TextField} from "@heroui/react";
import {useDictionary} from "./DictionaryContext";

export type InputModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    heading: string;
    label: string;
    modalLabel: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    defaultValue?: string;
    submitLabel?: string;
    validateTextField?: (value: string) => true | string;
};

export const InputModal = ({
                               isOpen,
                               onOpenChange,
                               onSubmit,
                               heading,
                               label,
                               modalLabel,
                               name,
                               type = "text",
                               placeholder,
                               defaultValue,
                               submitLabel,
                               validateTextField
                           }: InputModalProps) => {
    const dictionary = useDictionary();

    return (<Modal>
        <Modal.Backdrop variant='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog aria-label={modalLabel}>
                    <Modal.CloseTrigger aria-label={dictionary.common.close}/>
                    <Modal.Header className='my-4'>
                        <Modal.Heading>{heading}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={onSubmit} className='flex flex-col gap-4'>
                            <TextField
                                name={name}
                                fullWidth
                                validate={validateTextField}
                                defaultValue={defaultValue}
                            >
                                <Label>{label}</Label>
                                <Input variant='secondary' autoFocus placeholder={placeholder} type={type}/>
                                <FieldError/>
                            </TextField>
                            <Button type='submit' fullWidth>{submitLabel || dictionary.common.ok}</Button>
                        </Form>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>)
}