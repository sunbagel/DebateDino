import { cn } from '@/lib/shadcn-utils'
import { Button } from '@/shadcn-components/ui/button'
import { Card, CardContent } from '@/shadcn-components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/shadcn-components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn-components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import ShortAnswer from './ShortAnswer'
import LongAnswer from './LongAnswer'
import MultipleChoice from './MultipleChoice'



const questionTypes = [
    {
      value: "input",
      label: "Short Answer",
    },
    {
      value: "textarea",
      label: "Long Answer",
    },
    {
      value: "multichoice",
      label: "Multiple Choice",
    },
  ]
  

function Question() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                        >
                        {value
                            ? questionTypes.find((question) => question.value === value)?.label
                            : "Select question..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search question..." className="h-9" />
                            <CommandEmpty>No question found.</CommandEmpty>
                            <CommandGroup>
                                {questionTypes.map((question) => (
                                    <CommandItem
                                        key={question.value}
                                        value={question.value}
                                        onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        }}
                                    >
                                        {question.label}
                                        <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === question.value ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>

            </CardContent>
            <CardContent>
                {value === 'input' && <ShortAnswer />}
                {value === 'textarea' && <LongAnswer />}
                {value === 'multichoice' && <MultipleChoice />}
            </CardContent>
        </Card>
    )
}

export default Question