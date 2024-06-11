import { createContext, useState } from "react";
// import run from "../config/gemini"
import runChat from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState(""); // Saves the users input
  const [recentPrompt, setRecentPrompt] = useState(""); // the user input will be saved in this state
  const [previousPrompts, setPreviousPrompts] = useState([]); // stores all the input history
  const [showResult, setShowResult] = useState(false); // Will render the results based on a truthy value
  const [loading, setLoading] = useState(false); // If true will show the loading animation
  const [resultData, setResultData] = useState(""); // 

  const delayPara = (index,nextWord) =>{

  }

  const onSent = async (prompt) => {

    try {
      setResultData("")
      setLoading(true)
      setShowResult(true)
      setRecentPrompt(input)
      const res = await runChat(input);
      let responseArray = res.split("**");
      let newResponse;
      for(let i = 0; i < responseArray.length; i++)
        {
            if(i === 0 || i%2  == 1){
                newResponse += responseArray[i]
            }
            else{
                newResponse += "<b>"+ responseArray[i] + "</b>";
            }
      }
      setResultData(newResponse);
      setLoading(false)
      setInput("")
    } 
    catch (e) {
      return console.log("🥯", e);
    }
  };

//   onSent(input);

  const contextValue = {
    previousPrompts,
    setPreviousPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
