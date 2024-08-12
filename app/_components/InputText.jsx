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

function InputText(props) {

    const {form, name, label, placeholder, formClass, isDisabled } = props

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem className={formClass}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                <Input placeholder={placeholder} {...field} disabled={isDisabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}

export default InputText
