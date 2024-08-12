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

import {
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList,
} from "@/components/ui/command"

import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

function Dropdown(props) {

    const {form, name, label, placeholder, dropdownFields, formClass, isDisabled } = props

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem className={`flex flex-col justify-end ${formClass}`} style={{ margin: 0, padding: 0 }}>
                <FormLabel>{label}</FormLabel>
                <Popover>
                <PopoverTrigger asChild>
                    <FormControl className="h-10 px-4 py-2">
                    <Button
                        disabled={isDisabled}
                        variant="outline"
                        role="combobox"
                        className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value
                        ? dropdownFields.find(
                            (type) => type.value === field.value
                            )?.label
                        : placeholder }
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                    <CommandList>
                        <CommandGroup>

                        {dropdownFields.map((type) => (
                            <CommandItem
                            key={type.value}
                            onSelect={() => {
                                field.onChange(type.value); 
                            }}
                            >
                            {type.label}
                            <CheckIcon
                                className={cn(
                                "ml-auto h-4 w-4",
                                type.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}


export default Dropdown
