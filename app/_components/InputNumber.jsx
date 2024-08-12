import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"

function InputNumber(props) {

    const {form, name, label, placeholder, isDisabled } = props

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem >
                <FormLabel>{label}</FormLabel>
                <FormControl>
                <Input type="number" min={0} placeholder={placeholder}
                 value={field.value || ''}
                 onChange={(e) => {
                     const value = e.target.value;
                     field.onChange(value ? Number(value) : undefined );
                 }}
                 disabled={isDisabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}

        />
    )
}

export default InputNumber
