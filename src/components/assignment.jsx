import { useState, useEffect, createElement } from 'react';
import { Button, Card, ListGroup } from 'flowbite-react';
import * as Fa from 'react-icons/fa';
import Steps from './steps.jsx';


export default function Assignment(props) { 
    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('value')) || {};
        if (value.selectedProject) {
          setSelectedProject(value.selectedProject);
        }
      }, []);
    const newIconArray = props.icons.map((icon, i) => (
        icon = icon.replace('-', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => match.toUpperCase()).replace(/\s+/g, ''),
        !icon.startsWith('Fa') ? icon = `Fa${icon}` : icon
    ));
   console.log(newIconArray);
    
    const resetAll = () => {
        localStorage.removeItem("value");
        window.location.reload();
    };
    const [selectedProject, setSelectedProject] = useState("");
    const article = props.baseKnowledge === "absolute beginner" ? "an" : "a";
    useEffect(() => {
        const popover = document.querySelector("#popover-tip");
        const popoverTarget = document.querySelector("[data-popover-target]");
      
        function showPopover() {
          popover.classList.remove("invisible");
          popover.classList.add("opacity-100");
        }
      
        function hidePopover() {
          popover.classList.remove("opacity-100");
          popover.classList.add("invisible");
        }
      
        popoverTarget.addEventListener("mouseenter", showPopover);
        popoverTarget.addEventListener("mouseleave", hidePopover);
        popoverTarget.addEventListener("click", showPopover);
        popover.addEventListener("mouseenter", showPopover);
        popoverTarget.addEventListener("focus", showPopover);
        popoverTarget.addEventListener("blur", hidePopover);
        popover.addEventListener("mouseleave", hidePopover);
      
        return () => {
          popoverTarget.removeEventListener("mouseenter", showPopover);
          popoverTarget.removeEventListener("mouseleave", hidePopover);
          popoverTarget.removeEventListener("click", showPopover);
          popover.removeEventListener("mouseenter", showPopover);
          popoverTarget.removeEventListener("focus", showPopover);
          popoverTarget.removeEventListener("blur", hidePopover);
          popover.removeEventListener("mouseleave", hidePopover);
        };
      }, []);

    function handleClick(project) {
        const value = JSON.parse(localStorage.getItem('value')) || {};
        value.selectedProject = project;
        localStorage.setItem('value', JSON.stringify(value));
        setSelectedProject(project)
    }

  return (
    <>
        <div id="assignment" className='prose-lg'>
            <h2 className="text-3xl">Assignment 1: Understanding {props.concept}</h2>
            <div id="assignContainer">
                {selectedProject === "" 
                ? <>
                    <p>To start learning {props.choice} as {article} {props.baseKnowledge}, we'll focus on understanding {props.concept}.</p> 
                    <div className='flex flex-col rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 md:flex-row p-5 m-5'><div className='w-100'><Fa.FaInfoCircle className='mx-auto my-2 md:mx-0' size={42} /></div><div className='w-100 text-left px-2'>{props.definition}</div></div><p>Don't worry if that doesn't make a lot of sense yet. In programming and development, concepts are always easier to grasp when we can actually use them. That's why we'll be building <a href="#" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline py-8" data-popover-target="popover-image">an MVP version</a> of a simple project for our first assignment. You can choose any one of these ideas:</p><div id="popover-tip" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-96 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600" data-popper-placement="top">
                          <div className="w-300 p-5 text-left">
                              <h3 className="font-semibold text-gray-900 dark:text-white">What's an MVP?</h3>
                              <p>A minimum viable product (MVP) is a version of a product with just enough features to be usable for its intended purpose.</p>
                              <a href="https://en.wikipedia.org/wiki/Minimum_viable_product" className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline">
                                  Read more <svg className="w-2 h-2 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                  </svg>
                              </a>
                          </div>
                      </div>
                      <ListGroup className="m-5">
                        {props.projects.map((project, i) => (
                            <ListGroup.Item key={i} onClick={() => handleClick(project)}>
                              <div className="flex flex-col md:flex-row md:vertical-middle">
                                <div className='w-100'>{createElement(Fa[newIconArray[i]], {size: 42, className: 'mx-auto my-2 md:mx-0' })}</div>
                                <div className='w-100 text-left p-2'>{project}</div>
                              </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
                : 
                <Card className="introFrame max-w-screen-md mx-auto bg-transparent dark:bg-transparent border-transparent dark:border-transparent shadow-none">
                    {selectedProject.replace(/(\d+.)/g, '')}
                    <Steps project={selectedProject} choice={props.choice} concept={props.concept} baseKnowledge={props.baseKnowledge} />
                </Card> 
                }
            </div>
            <Button className="mt-5 mx-auto bg-gray-500 dark:bg-gray-500" onClick={resetAll}>Start over</Button>
        </div>
    </>
  );
}