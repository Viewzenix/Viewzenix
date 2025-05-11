import { Field as ChakraField } from '@chakra-ui/react';
import { createContext, useContext } from 'react';

interface FieldContextValue {
  id?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const FieldContext = createContext<FieldContextValue>({});

interface FieldRootProps {
  id?: string;
  children: React.ReactNode;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

function Root({ id, children, invalid, required, disabled }: FieldRootProps) {
  return (
    <FieldContext.Provider value={{ id, invalid, required, disabled }}>
      <ChakraField.Root id={id} invalid={invalid} required={required} disabled={disabled}>
        {children}
      </ChakraField.Root>
    </FieldContext.Provider>
  );
}

interface FieldLabelProps {
  children: React.ReactNode;
}

function Label({ children }: FieldLabelProps) {
  const { id } = useContext(FieldContext);
  return <ChakraField.Label htmlFor={id}>{children}</ChakraField.Label>;
}

interface FieldErrorTextProps {
  children: React.ReactNode;
}

function ErrorText({ children }: FieldErrorTextProps) {
  return <ChakraField.ErrorText>{children}</ChakraField.ErrorText>;
}

interface FieldHelperTextProps {
  children: React.ReactNode;
}

function HelperText({ children }: FieldHelperTextProps) {
  return <ChakraField.HelperText>{children}</ChakraField.HelperText>;
}

export const Field = {
  Root,
  Label,
  ErrorText,
  HelperText,
};