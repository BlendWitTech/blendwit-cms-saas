import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormContextType {
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;
    saveHandler: (() => Promise<void>) | null;
    registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
    const [isDirty, setIsDirty] = useState(false);
    const [saveHandler, setSaveHandler] = useState<(() => Promise<void>) | null>(null);

    const registerSaveHandler = (handler: (() => Promise<void>) | null) => {
        setSaveHandler(() => handler);
    };

    return (
        <FormContext.Provider value={{ isDirty, setIsDirty, saveHandler, registerSaveHandler }}>
            {children}
        </FormContext.Provider>
    );
}

export function useForm() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useForm must be used within a FormProvider');
    }
    return context;
}
