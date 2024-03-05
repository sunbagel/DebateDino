import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn-components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn-components/ui/form";
import { Input } from "@/shadcn-components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { UseFormGetValues, useFieldArray, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { Switch } from "@/shadcn-components/ui/switch";
import { Textarea } from "@/shadcn-components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/shadcn-components/ui/radio-group";
import { Button } from "@/shadcn-components/ui/button";
import ShortAnswer from "./questions/ShortAnswer";
import LongAnswer from "./questions/LongAnswer";
import MultipleChoice from "./questions/MultipleChoice";
import Question from "./questions/Question";

type initialTournament = {
  name: string;
  description: string;
  date: Date;
  location: string;
  refundPolicy: string;
}

interface Question {
  type: string;
  id: number;
}






const CreateTournamentForm = () => {
  const location = useLocation();
  const locationState = (location.state as {data? : initialTournament})
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => {
    console.log(locationState);
  }, [locationState])

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="w-1/2"></div>
        <div className="flex md:fixed justify-center items-center z-0 w-full md:w-1/3 top-200 m-5">
          <img src="../../survey.png" className="w-full" alt="Debate Tournaments"/>
        </div>
        <div className="md:flex-1">
          <div className="flex pt-10">
            <div className="flex flex-col">
              <h1 className="text-5xl font-bold">What do you want to ask your participants?</h1>
              <br/>
              <h2 className="text-2xl text-gray-500">Create a Form</h2>
            </div>
          </div>
          <div className="pt-5">
            <Question/>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CreateTournamentForm