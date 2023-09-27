import { useState, useEffect, createElement } from 'react';
import { OpenAI } from "openai";
import { Button, ListGroup, Spinner } from 'flowbite-react';
import * as FontAwesome from 'react-icons/fa';
import presetsProjectSteps from '../../presetsProjectSteps.json';



export default function Steps(props) { 
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const [steps, setSteps] = useState("");
    const openai = new OpenAI({
        apiKey: apiKey,
      });
    
    const getSteps = async (project, choice, concept, baseKnowledge) => {
        try{
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `I want to create ${project} to understand ${concept} in the context of ${choice}. My experience level in ${choice} is ${baseKnowledge}. Break down the steps I need to take in detail, from start to finish. If I am a beginner, please assume I will not need a web host for my project but will only create a static, local version for now. Please include any tools I need to install. Return your advice with three line breaks between each step.`
            }],
            temperature: 0.66,
            top_p: 0,
            n: 1,
            max_tokens: 500,
            stream: false,
            frequency_penalty: 0.29,
            stop: "###"
        });
            const stepsString = response.choices[0].message.content;
            const steps1 = stepsString.split(':\n\n')[1];
            const stepsArray = steps1.split('\n\n');
            return stepsArray;
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
            {loading ? <Spinner size="xl" aria-label="Loading, please wait..." />            
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
