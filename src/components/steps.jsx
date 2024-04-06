import { useState, useEffect, createElement } from 'react';
import { Button, ListGroup, Spinner } from 'flowbite-react';
import * as FontAwesome from 'react-icons/fa';
import presetsProjectSteps from '../../presetsProjectSteps.json';



export default function Steps(props) { 
    const [steps, setSteps] = useState("");
    
    const getSteps = async (project, choice, concept, baseKnowledge) => {
        const _query = `I want to create ${project} to understand ${concept} in the context of ${choice}. My experience level in ${choice} is ${baseKnowledge}. Break down the steps I need to take in detail, from start to finish. If I am an Absolute Beginner, please assume I will not need a web host for my project but will only create a static, local version for now. Please include any tools I need to install. Your response should be formatted as numbered steps, with no introduction, preamble, or pleasantries. Insert six x characters at the end of each numbered step so we can easily break the result into an array.`;
        const response = await fetch(`https://seashell-app-fxv3c.ondigitalocean.app/api?${_query}`);
        const data = await response.json();
        console.log(data);
        const stepsString = data.details.choices[0].message.content;
        console.log(stepsString);
        const stepsArray = stepsString.split('xxxxxx');
        console.log(stepsArray);
        return stepsArray;
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('value')) || {};
        if (value.projectSteps) {
          setSteps(value.projectSteps);
          setLoading(false);
        } else {
            console.log(props.project, props.choice, props.baseKnowledge);
            getSteps(props.project, props.choice, props.concept, props.baseKnowledge)
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
