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


function TimeInput(props) {

    const {form, name, label, formClass } = props

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem className={`flex flex-col w-full md:w-auto ${formClass}`}>
                <FormLabel>{label}</FormLabel>
                <FormControl className="h-10 px-4 py-2">
                <input
                    type="time"
                    className="input-class"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}

export default TimeInput
