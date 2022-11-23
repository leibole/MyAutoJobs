import {
  Controller,
  Control,
  FieldValues,
  FieldPath,
  UseControllerProps,
} from "react-hook-form";
import { Input as MuiInput } from "@mui/material";

export const Input = <T extends FieldValues>({
  name,
  control,
  rules,
}: {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: { required: { value: boolean; message: string } };
}) => {
  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field }) => <MuiInput {...field} id={name} />}
    />
  );
};
