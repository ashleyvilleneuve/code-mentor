import { useState, useEffect, createElement } from 'react';
import { Button, ListGroup, Spinner } from 'flowbite-react';
import * as FontAwesome from 'react-icons/fa';
import presetsProjectSteps from '../../presetsProjectSteps.json';



export default function Steps(props) { 
    // const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const [steps, setSteps] = useState("");
    // const openai = new OpenAI({
    //     // apiKey: apiKey,
    //   });
    
    const getSteps = async (project, choice, concept, baseKnowledge) => {
        const _query = `I want to create ${project} to understand ${concept} in the context of ${choice}. My experience level in ${choice} is ${baseKnowledge}. Break down the steps I need to take in detail, from start to finish. If I am a beginner, please assume I will not need a web host for my project but will only create a static, local version for now. Please include any tools I need to install. Return your advice with three line breaks between each step.`;
        const response = await fetch(`https://rocky-reef-04614-fdf56f3c6cef.herokuapp.com/api?${_query}`);
        const data = await response.json();
        console.log(data);
        const stepsString = data.details.choices[0].message.content;
        const steps1 = stepsString.split(':\n\n')[1];
        const stepsArray = steps1.split('\n\n');
        return stepsArray;
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('value')) || {};
        if (value.projectSteps) {
          setSteps(value.projectSteps);
          setLoading(false);
        } else if (props.choice === "Web Development" || props.choice === "Javascript") {
            const shortProject = props.project.replace(/\d/g, '').replace('.', '').split(':')[0].trim()
            const stepsData = presetsProjectSteps.filter(item => {
                return item.Project === shortProject;
              });
            const steps = stepsData[0].Steps.split('###');
            value.projectSteps = steps;
            localStorage.setItem('value', JSON.stringify(value));
            setSteps(steps);
            setLoading(false);
        } else {
            getSteps(props.project, props.choice, props.baseKnowledge)
            .then((steps) => {
                value.projectSteps = steps;
                localStorage.setItem('value', JSON.stringify(value));
                setSteps(steps);
                setLoading(false);
            })
            .catch((error) => {
                setError(true);
                setLoading(false);
            });
        }
    }, []);
    return (
        <>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {loading ? <div><Spinner size="xl" aria-label="Loading, please wait..." /><h3>Preparing steps for the project you selected...</h3>     </div>   
            : <ListGroup className="m-5">
                {steps.map((step, i) => (
                    <ListGroup.Item key={i}>
                        {step}
                    </ListGroup.Item>
                ))}
            </ListGroup>}
        </div>
        </>
    )
}
