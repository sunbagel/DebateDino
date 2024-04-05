import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn-components/ui/form'
import { Tournament } from '@/types/tournaments'
import { useFieldArray } from 'react-hook-form'
import QuestionPicker from './QuestionPicker'
import { Button } from '@/shadcn-components/ui/button'

const MemberForm = ({teamIdx, form, tournament}: {teamIdx: number, form: unknown, tournament: Tournament | undefined}) => {

    const {fields: memberFields, append: memberAppend, remove: memberRemove} = useFieldArray({
        name: `teams.${teamIdx}.members`,
        control: form.control
    })


    return (
        <>
            {memberFields.map((f, memberIdx) => {
                return (
                    <div key={f.id} className="pt-10">
                        <div className="flex flex-row justify-between">
                            <h1 className="font-bold text-xl">Member #{memberIdx+1}</h1>
                            <Button variant="ghost" onClick={() => {memberRemove(memberIdx)}}>
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </Button>
                        </div>
                        {tournament?.form.memberQuestions.map((memberQuestion, memberQuestionIdx) => {
                            if (!form.getValues(`teams.${teamIdx}.members.${memberIdx}.memberResponses.${memberQuestionIdx}`)) {
                                form.setValue(`teams.${teamIdx}.members.${memberIdx}.memberResponses.${memberQuestionIdx}`, {
                                    questionId: memberQuestion._id,
                                    answer: ""
                                })
                            }
                            return (
                                <div key={memberQuestionIdx}>
                                    <FormField
                                        control={form.control}
                                        name={`teams.${teamIdx}.members.${memberIdx}.memberResponses.${memberQuestionIdx}.answer`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{memberQuestion.text}</FormLabel>
                                                <FormControl>
                                                    <QuestionPicker field={field} type={memberQuestion.type} options={memberQuestion.options ? memberQuestion.options : []} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            <Button onClick={() => memberAppend({
                memberResponses: []
            })} type="button" className="w-full mt-5">Add Member</Button>
        </>
        
    )
}

export default MemberForm