import { Card, CardContent } from '@/shadcn-components/ui/card'
import { FormControl, FormField, FormItem, FormLabel } from '@/shadcn-components/ui/form'
import { Input } from '@/shadcn-components/ui/input'
import { Switch } from '@/shadcn-components/ui/switch'

function ShortAnswer({form, idx, section}) {
    
    return (
        <Card className='pt-5 mt-5'>
            <CardContent>
                <FormField
                    control={form.control}
                    name={`form.${section}.${idx}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Unnamed Question" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input placeholder="Short Answer Text" disabled />
                    </FormControl>
                </FormItem>
                <FormField
                    control={form.control}
                    name={`form.${section}.${idx}.isRequired`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="pt-4 space-y-0.5 flex flex-row items-center gap-3">
                                <FormLabel>Required</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}

export default ShortAnswer