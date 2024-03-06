import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Question from "./questions/Question";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button } from "@/shadcn-components/ui/button";

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
  const [questions, setQuestions] = useState<Question[]>([{type: '', id: 0}]);
  useEffect(() => {
    console.log(locationState);
  }, [locationState])

  const editQuestion = (id: number, q) => {
    const index = questions.findIndex(question => question.id == id);
    if (index !== -1) {
      setQuestions(prevQuestions => [
        ...prevQuestions.slice(0, index),
        {...prevQuestions[index], ...q},
        ...prevQuestions.slice(index + 1)
      ]);
    }
  }

  const addNewQuestion = () => {
    const m = new Map();
    questions.forEach(q => {
      m.set(q.id, true);
    })
    const sortedM = [...m.keys()].sort();
    for (const key of sortedM) {
      if (!m.get(key + 1)) {
        setQuestions([...questions, {type: '', id: key + 1}])
        return;
      }
    }
    setQuestions([...questions, {type: '', id: 0}])
  }

  const deleteQuestion = (id: number) => {
    const index = questions.findIndex(question => question.id == id);
    console.log(id, index);
    console.log('first', questions.slice(0, index))
    console.log('second', questions.slice(index + 1))
    console.log('final', [...questions.slice(0, index), ...questions.slice(index + 1)])
    if (index !== -1) {
      setQuestions(prevQuestions => [
        ...prevQuestions.slice(0, index),
        ...prevQuestions.slice(index + 1)
      ]);
    }
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="w-1/2"></div>
        <div className="flex md:fixed justify-center items-center z-0 w-full md:w-1/2 m-5 left-0 top-10">
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

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <ul className="questions" {...provided.droppableProps} ref={provided.innerRef}>
                    {questions.map(({id}, index) => {
                      return (
                        <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div key={id}>
                                <Question deleteQuestion={deleteQuestion} id={id} questions={questions} editQuestion={editQuestion} />
                              </div>
                            </li>
                          )}
                        </Draggable>
                      )
                    })}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>


          </div>
          <div className="pt-5 flex justify-center">
            <Button onClick={addNewQuestion} className="w-full">Add</Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CreateTournamentForm