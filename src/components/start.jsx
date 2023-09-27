import { useState } from 'react';
import { Button, Spinner } from "flowbite-react";
import classNames from 'classnames';
import Creatable from 'react-select/creatable';
import { OpenAI } from "openai";
import Radio from './radio.jsx';
import Assignment from './assignment.jsx';
import presetsChoices from '../../presetsChoices.json';

export default function GetStarted() { 
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const [choice, setChoice] = useState("web development");
    const handleChange = (opt, meta) => {
        setChoice(opt.value);
        document.getElementById("levelButtons").classList.remove("hidden");
        document.getElementById("subjectButtons").classList.add("hidden");
    };
    const [baseKnowledge, setBaseKnowledge] = useState("absolute beginner");
    const onOptionChange = e => {
        setBaseKnowledge(e.target.value)
      };
    const openai = new OpenAI({
        apiKey: apiKey,
      });
    const storeData = (value) => {
        try {
            localStorage.setItem("value", JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };
    const cancel = () => {
        localStorage.removeItem("value");
        window.location.reload();
    };
    const [assignment, setAssignment] = useState("");

    const firstConcept = async (choice, baseKnowledge) => {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `I want to learn "${choice}". My experience level in this topic is "${baseKnowledge}. In a single word, which concept should I learn first?`
                }],
                temperature: 0.66,
                top_p: 0,
                n: 1,
                max_tokens: 60,
                stream: false,
                frequency_penalty: 0.29,
                stop: "###"
            });
            const concept = response.choices[0].message.content;
            const newResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Define "${concept}" in the context of ${choice}. Be as concise as possible.`
                }],
                temperature: 0.66,
                top_p: 0,
                n: 1,
                max_tokens: 60,
                stream: false,
                frequency_penalty: 0.29,
                stop: "###"
            });
            const definition = newResponse.choices[0].message.content;
            return [definition, concept];
        } catch (error) {
            if (error instanceof OpenAI.APIError) {
                console.error(error.status);  // e.g. 401
                console.error(error.message); // e.g. The authentication token you passed was invalid...
                console.error(error.code);  // e.g. 'invalid_api_key'
                console.error(error.type);  // e.g. 'invalid_request_error'
            } else {
                // Non-API error
                console.log(error);
            }
        } finally {
            console.log("Done");
        }
    };
    const firstProject = async (choice, firstConcept) => {
        try{
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `To begin learning "${choice}" with the concept "${firstConcept}", what are 3 good first MVP projects I could build? Answer in point form.`
            }],
            temperature: 0.66,
            top_p: 0,
            n: 1,
            max_tokens: 200,
            stream: false,
            frequency_penalty: 0.29,
            stop: "###"
        });
        const projects = response.choices[0].message.content;
        const iconsResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `For each of the projects listed in ${projects}, suggest a good icon to represent it. Choose from icons available in React Icons Font Awesome collection.`
            }],
            temperature: 0.66,
            top_p: 0,
            n: 1,
            max_tokens: 200,
            stream: false,
            frequency_penalty: 0.29,
            stop: "###"
        });
        const icons = iconsResponse.choices[0].message.content;
        return [projects, icons];
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);  // e.g. 401
            console.error(error.message); // e.g. The authentication token you passed was invalid...
            console.error(error.code);  // e.g. 'invalid_api_key'
            console.error(error.type);  // e.g. 'invalid_request_error'
        } else {
            // Non-API error
            console.log(error);
        }
    } finally {
        console.log("Done");
    }
};
    const back = () => {
        localStorage.removeItem("value");
        document.getElementById("subjectButtons").classList.remove("hidden");
        document.getElementById("levelButtons").classList.add("hidden");
    };

    const getStarted = async () => {
        document.getElementById("levelButtons").classList.add("hidden");
        document.getElementById("assignment").classList.remove("hidden");
        const date = new Date().getTime();
        const responseValues = {};
        if (choice === "Web Development" || choice === "Javascript") {
            const filteredData = presetsChoices.filter(item => {
                return item.Choice === choice && item.Level === baseKnowledge;
              });
            responseValues.definition = filteredData[0].Definition;
            responseValues.concept = filteredData[0].Concept;
            const projects = filteredData[0].Projects;
            responseValues.iconArray = filteredData[0].Icons.split(",");
            responseValues.projectArray = projects.split("###");
        } else {
            const conceptState = await firstConcept(choice, baseKnowledge);
            responseValues.definition = conceptState[0];
            responseValues.concept = conceptState[1];
            const projectState = await firstProject(choice, responseValues.concept);
            const projects = projectState[0];
            const icons = projectState[1];
            responseValues.iconArray = icons.split("\n\n");
            responseValues.iconArray.map((icon, i) => {
                icon.includes('\"') ? responseValues.iconArray[i] = icon.split('\"')[1].split('\"')[0] : responseValues.iconArray[i] = icon;
            });
            responseValues.projectArray = projects.split("\n\n");
        }
        
        const value = {
            id: date,
            baseKnowledge: baseKnowledge,
            choice: choice,
            concept: responseValues.concept,
            definition: responseValues.definition,
            projects: responseValues.projectArray,
            icons: responseValues.iconArray
            };
        storeData(value);
        setAssignment(<Assignment choice={choice} baseKnowledge={baseKnowledge} concept={responseValues.concept} projects={responseValues.projectArray} definition={responseValues.definition} icons={responseValues.iconArray} />);
        setLoading(false);
    };
    const choiceOptions = [
        { label: 'Web Development', value: 'Web Development' },
        { label: 'Javascript', value: 'Javascript' },
        { label: 'React', value: 'React' },
        { label: 'Vue', value: 'Vue' },
        { label: 'Mobile App Development', value: 'Mobile App Development' },
        { label: 'CSS', value: 'CSS' },
      ];
    const levels = [
        {
            level: 'Absolute Beginner',
            subtitle: 'I have no idea what it is.',
        },
        {
            level: 'Intermediate',
            subtitle: 'I have a basic understanding of it, but still feel like there is a lot I don\'t know.',
        }, 
        {
            level: 'Advanced',
            subtitle: 'I have a good understanding of it, but would love to learn more.',
        }
    ]
    const levelRadios = levels.map((level, i) => (
        <Radio key={i} name="baseKnowledge" value={level.level} subtitle={level.subtitle} handler={onOptionChange} checked={baseKnowledge === level.level} />
    ));

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

  return (
    <>
        <div id="subjectButtons" className='card text-center'>
            <Creatable // https://react-select.com/creatable can have onCreateOption prop to handle created options
                id="subjects" 
                unstyled={true}
                placeholder="Choose a subject, or type your own"
                formatCreateLabel={userInput => `Learn "${userInput}"`}
                classNames={{
                    control: ({ isDisabled, isFocused }) =>
                      classNames(
                        'border border-gray-300 bg-gray-700 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-gray-50',
                        !isDisabled && isFocused && 'border-blue-800',
                        isFocused && 'ring-blue-500 border-blue-500',
                        isFocused && 'hover:border-blue-800'
                      ),
                    option: ({ isDisabled, isFocused, isSelected }) =>
                      classNames('bg-gray-700 text-white text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-gray-50',
                        isSelected && 'bg-gray-800',
                        !isSelected && isFocused && 'bg-gray-300',
                        !isDisabled && isSelected && 'active:bg-gray-800',
                        !isDisabled && !isSelected && 'active:bg-gray-500'
                      ),
                }}
                options={choiceOptions}
                onChange={handleChange}
            />
        </div>
        <div id="levelButtons" className='hidden'>
            <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">How much do you know about {choice} right now?</h3>
            <ul className="grid w-full gap-0 md:grid-cols-3 my-5">
                {levelRadios}
            </ul>

            <div className='mx-auto flex flex-row justify-center'><Button className="mt-5 m-2 bg-gray-500 dark:bg-gray-500" onClick={back}>Go back</Button><Button className="mt-5 m-2 flex-row" onClick={getStarted}>Continue</Button></div>
        </div>
        <div id="assignment" className='hidden'>
            {loading ? <Spinner size="xl" aria-label="Loading, please wait..." /> 
            : assignment
            }
        </div>
    </>
  );
}