import { FormControl } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-components/ui/select'
import { Textarea } from '@/shadcn-components/ui/textarea'
import React from 'react'

const QuestionPicker = ({field, type, options, isRequired=false}) => {

    return (
        <>
            {type === 'input' && (
                <Input {...field} required={isRequired} />
            )}
            {type === 'textarea' && (
                <Textarea {...field} required={isRequired} />
            )}
            {type === 'select' && (
                <Select onValueChange={field.onChange} defaultValue={field.value} required={isRequired}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {options.map((option, index) => {
                            return (
                                <SelectItem key={index} value={option}>{option}</SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            )}
        </>
        
    )
}

export default QuestionPicker