import { cn } from '@/lib/shadcn-utils'
import { Button } from '@/shadcn-components/ui/button'
import { Card, CardContent } from '@/shadcn-components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/shadcn-components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn-components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import ShortAnswer from './ShortAnswer'
import LongAnswer from './LongAnswer'
import MultipleChoice from './MultipleChoice'

interface Question {
    type: string;
    id: number;
}

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
  

function Question({deleteQuestion, id, questions, editQuestion}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(() => {
        console.log('hihihihi');
        const index = questions.findIndex((q: Question) => q.id == id);
        setValue(questions[index].type);
        console.log('value', value);
    }, [questions])

    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <div className="flex justify-between">
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
                                : "Select Type"}
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
                                                editQuestion(id, {type: currentValue === value ? "" : currentValue})
                                                
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
                    <Button variant="ghost" onClick={() => deleteQuestion(id)}>
                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </Button>
                </div>
                
                {value === 'input' && <ShortAnswer />}
                {value === 'textarea' && <LongAnswer />}
                {value === 'multichoice' && <MultipleChoice />}
            </CardContent>
        </Card>
    )
}

export default Question