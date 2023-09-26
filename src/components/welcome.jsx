import { useState, useEffect, useCallback } from 'react';
import { Card } from 'flowbite-react';
import GetStarted from './start.jsx';


let running = true;

export default function Welcome() {
    const subjects = ['Web Development', 'Javascript', 'React', 'Vue', 'Svelte', 'CSS', 'App Development']
    let i = Math.floor(Math.random() * subjects.length)
    const [time, setTime] = useState(new Date());
    const timeOfDay = time.getHours() < 12 ? 'morning' : 'afternoon';
    const [subject, setSubject] = useState(subjects[i]);
    const [running, setRunning] = useState(true);
    const toggleRunning = useCallback(
        () => setRunning(run => !run)
    , []);
      
    useEffect(() => {
          if(!running) {
            return;
          }
        const interval = setInterval(() => {
            setTime(new Date());
            i = i + 1 === subjects.length ? 0 : i + 1;
            setSubject((subject) => subjects[i]);
            }, 1500);
        return () => clearInterval(interval);
        
      }, [running]);

    
    function updateContent() {
        toggleRunning();
        const introEls = document.getElementsByClassName("intro");
        if (introEls.length > 0) {
            [...introEls].forEach((thisEl) => {
                console.log(thisEl);
                thisEl.classList.add("hidden");
            });
            document.getElementById("content").classList.remove("hidden");
        }
    }

    function Animate({ children, on }) {
        return (on === undefined)
            ? ""
            : <div className="animate-zoomIn m-10 w-100 text-7xl font-extrabold intro" key={on}>{children}</div>
        }

    return (
        <>
            <div className='intro'>
                <Animate on={subject}>{subject}</Animate>
                <div id="initialButton" className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-950" onClick={updateContent}>
                        Get started
                        <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </a>
                </div>
            </div>
            <div id="content" className='hidden'>
                <GetStarted />
            </div>
        </>
    );

}