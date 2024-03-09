import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/shadcn-components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn-components/ui/form"
import { Input } from "@/shadcn-components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn-components/ui/popover";
import { cn } from "@/lib/shadcn-utils";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/shadcn-components/ui/calendar"
import { Textarea } from "@/shadcn-components/ui/textarea"
import axios from '@/lib/axios'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn-components/ui/pagination"
import CreateTournamentStart from "./CreateTournamentStart"
import CreateTournamentForm from "./CreateTournamentForm"
import { Tournament } from "@/types/tournaments"

const tournamentSchema = z.object({
    host: z.string(),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }).max(20),
    description: z.string().max(2000),
    date: z.date({
        required_error: "A date is required.",
    }),
    location: z.string(),
    refundPolicy: z.string(),
    judges: z.array(z.string()).optional(),
    participants: z.array(z.string()).optional(),
    image: z.string().url().optional(),
    form: z.object({
        questions: z.array(z.object({
            type: z.string(),
            text: z.string(),
            isRequired: z.boolean(),
            options: z.optional(
                z.array(z.string())
              ).refine((value, data) => {
                // Validate 'options' only if 'text' is 'select'
                return data.type !== "select" || (data.type === "select" && Array.isArray(value));
              }, { message: "Options must be provided for 'select' type questions" })
        }))
    })
})

const defaultTournament: Tournament = {
    host: "",
    name: "",
    description: "",
    date: "",
    location: "",
    refundPolicy: "",
    judges: [],
    participants: [],
    image: "",
    form: {
        questions: [
            {
                type: "",
                text: "",
                isRequired: false
            }
        ]
    }
}

const pages = [1,2];

const part1Schema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }).max(20),
    description: z.string().max(2000),
    date: z.date({
        required_error: "A date is required.",
    }),
    location: z.string(),
    refundPolicy: z.string(),
})

const CreateTournaments = () => {
    const [tournament, setTournament] = useState<Tournament>(defaultTournament);

    const part1Form = useForm<z.infer<typeof part1Schema>>({
        resolver: zodResolver(part1Schema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            refundPolicy: "",
            // judges: [],
            // participants: [],
            // image: "",
        },
    })

    function part1Submit(values: z.infer<typeof part1Schema>) {

        console.log(values)
    }

    const [activePage, setActivePage] = useState(1);

    const navigate = useNavigate();
    
    


    return (
        <div className="container mx-auto flex min-h-screen flex-col pb-10">
            <div className="pt-5 z-10">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious className={activePage === pages[0] ? "pointer-events-none opacity-50" : undefined} href="#" onClick={() => {
                                if (activePage > pages[0]) {
                                    setActivePage(activePage - 1);
                                }
                            }}/>
                        </PaginationItem>
                        {pages.map(page => {
                            return (
                                <PaginationItem>
                                    <PaginationLink href="#" isActive={activePage === page} onClick={() => setActivePage(page)}>{page}</PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationNext className={activePage === pages[pages.length - 1] ? "pointer-events-none opacity-50" : undefined} href="#" onClick={() => {
                                if (activePage < pages[pages.length - 1]) {
                                    setActivePage(activePage + 1);
                                }
                            }} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <div className="md:min-h-[710px]">
                {activePage === 1 && <CreateTournamentStart part1Form={part1Form} part1Submit={part1Submit} />}
                {activePage === 2 && <CreateTournamentForm />}
            </div>
            <div className="pt-5 z-10">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious className={activePage === pages[0] ? "pointer-events-none opacity-50" : undefined} href="#" onClick={() => {
                                if (activePage > pages[0]) {
                                    setActivePage(activePage - 1);
                                }
                            }}/>
                        </PaginationItem>
                        {pages.map(page => {
                            return (
                                <PaginationItem>
                                    <PaginationLink href="#" isActive={activePage === page} onClick={() => setActivePage(page)}>{page}</PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationNext className={activePage === pages[pages.length - 1] ? "pointer-events-none opacity-50" : undefined} href="#" onClick={() => {
                                
                                if (activePage < pages[pages.length - 1]) {
                                    setActivePage(activePage + 1);
                                }
                            }} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    
    )

}


export default CreateTournaments;