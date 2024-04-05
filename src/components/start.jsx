import { useState } from 'react';
import { Button, Spinner } from "flowbite-react";
import classNames from 'classnames';
import Creatable from 'react-select/creatable';
import Radio from './radio.jsx';
import Assignment from './assignment.jsx';
import presetsChoices from '../../presetsChoices.json';

export default function GetStarted() { 
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
    
    const back = () => {
        localStorage.removeItem("value");
        document.getElementById("subjectButtons").classList.remove("hidden");
        document.getElementById("levelButtons").classList.add("hidden");
    };
    
    const responseValues = {};

    async function getConcept(choice, baseKnowledge) {
        const first_query=`I want to learn "${choice}". My experience level in this topic is "${baseKnowledge}. In a single word, which concept should I learn first?`;
        const response = await fetch(`https://seashell-app-fxv3c.ondigitalocean.app/api?${first_query}`);
        const data = await response.json();
        console.log(data);
        let concept = data.details.choices[0].message.content;
        if (!concept){
            concept = "Variables";
        }
        return concept;
    }

    async function getDefinition(choice, concept) {
        const second_query=`Define "${concept}" in the context of ${choice}. Be as concise as possible.`;
        const response = await fetch(`https://seashell-app-fxv3c.ondigitalocean.app/api?${second_query}`);
        const data = await response.json();
        console.log(data);
        const definition = data.details.choices[0].message.content;
        return definition;
    }
    async function getProjects(choice, concept) {
        const third_query = `To begin learning "${choice}" with the concept "${concept}", what are 3 good first MVP projects I could build? Answer in point form.`;
        const response = await fetch(`https://seashell-app-fxv3c.ondigitalocean.app/api?${third_query}`);
        const data = await response.json();
        console.log(data);
        const projects = data.details.choices[0].message.content;
        return projects;
    }
    async function getIcons(projects) {
        const fourth_query=`For each of the projects listed in this objec: "${projects}", suggest one good, respresentative icon. Choose from icons available in React Icons Font Awesome collection. Your response should contain only the name of the icon you have chosen for each project in PascalCase, formatted as a numbered list. Do not include the names of the projects. Please do not include preambles or pleasnatries.`;
        const response = await fetch(`https://seashell-app-fxv3c.ondigitalocean.app/api?${fourth_query}`);
        const data = await response.json();
        console.log(data);
        const icons = data.details.choices[0].message.content;
        return icons;
    }

    async function cleanIconData(icons) {
        const iconArray = icons.split("\n");
        iconArray.map((icon, i) => {
            (/^\d/g).test(icon) ? iconArray[i] = iconArray[i].replace(/^\d/g, "").replace(": ", "").replace(". ", "") : iconArray[i] = icon;
            icon.includes('↵') ? iconArray[i] = iconArray[i].split('↵')[0] : iconArray[i] = iconArray[i];
            icon.includes(' (') ? iconArray[i] = iconArray[i].split('(')[0] : iconArray[i] = iconArray[i];
            console.log(iconArray[i]);
        });
        const filteredIcons = iconArray.filter(function(icon) {
            return !icon.startsWith('Note:');
        });
        console.log(`filteredIcons${filteredIcons}`)
        return filteredIcons;
    }

    async function cleanProjectData(projects) {
        const projectArray = projects.split("\n\n");
        const filteredProjects = projectArray.filter(function(project) {
            return !project.startsWith('Note:') && (/^\d/g).test(project);
        });
        console.log(filteredProjects)
        return filteredProjects;
    }

    async function saveToLocalStorage(baseKnowledge, choice, concept, definition, projects, icons) {
        const date = new Date().getTime();
        const value = {
            id: date,
            baseKnowledge: baseKnowledge,
            choice: choice,
            concept: concept,
            definition: definition,
            projects: projects,
            icons: icons
            };
        storeData(value);
    }
    async function getStarted() {
        document.getElementById("levelButtons").classList.add("hidden");
        document.getElementById("assignment").classList.remove("hidden");
        if (choice === "Web Development" || choice === "Javascript") {
            const filteredData = presetsChoices.filter(item => {
                return item.Choice === choice && item.Level === baseKnowledge;
              });
            responseValues.definition = filteredData[0].Definition;
            responseValues.concept = filteredData[0].Concept;
            const projects = filteredData[0].Projects;
            responseValues.iconArray = filteredData[0].Icons.split(",");
            responseValues.projectArray = projects.split("###");
            await saveToLocalStorage(baseKnowledge, choice, responseValues.concept, responseValues.definition, responseValues.projectArray, responseValues.iconArray); 
            setAssignment(<Assignment choice={choice} baseKnowledge={baseKnowledge} concept={responseValues.concept} projects={responseValues.projectArray} definition={responseValues.definition} icons={responseValues.iconArray} />);
        } else {
            responseValues.concept = await getConcept(choice, baseKnowledge);
            responseValues.definition = await getDefinition(choice, responseValues.concept);
            const projects = await getProjects(choice, responseValues.concept);
            const icons = await getIcons(projects);
            responseValues.projectArray = await cleanProjectData(projects);
            responseValues.iconArray = await cleanIconData(icons);
            await saveToLocalStorage(baseKnowledge, choice, responseValues.concept, responseValues.definition, responseValues.projectArray, responseValues.iconArray); 
            setAssignment(<Assignment choice={choice} baseKnowledge={baseKnowledge} concept={responseValues.concept} projects={responseValues.projectArray} definition={responseValues.definition} icons={responseValues.iconArray} />);
        }	      
        setLoading(false);
        console.log('All work done');
    }

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