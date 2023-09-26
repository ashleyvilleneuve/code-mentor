import { useState, useEffect } from 'react'
import { Card } from 'flowbite-react';
import './App.css'
import Welcome from './components/welcome.jsx'
import Assignment from './components/assignment';

function App() {

  
  const defaultContent = <Welcome />
  const assignment = localStorage.getItem("value") !== null ? 
    JSON.parse(localStorage.getItem("value"))
    : "";
    
  const content = assignment !== "" ?
    <Assignment choice={assignment.choice} baseKnowledge={assignment.baseKnowledge} concept={assignment.concept} definition={assignment.definition} projects={assignment.projects} icons={assignment.icons} />    
  : defaultContent;

  const welcomeSubtitle = assignment !== "" ?
    `Learning: ${assignment.choice}` :
    "What do you want to learn?"

  return (
    <>
      <section className="w-screen h-auto bg-transparent dark:bg-transparent">
          <div className="py-8 px-4 text-center lg:py-16">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Welcome to Code Mentor</h1>
              <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">{welcomeSubtitle}</p>
              <Card className="introFrame max-w-screen-md mx-auto bg-transparent dark:bg-transparent border-transparent dark:border-transparent shadow-none">
                { content }
              </Card>
          </div>
      </section>
    </>
  )
}

export default App
