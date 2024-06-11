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

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () =>{
    setLoading(false);
    setShowResult(false);

  }

  const onSent = async (prompt) => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);
      let response;
      if(prompt !== undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt);

      }
      else{
        setPreviousPrompts(prev=>[...prev,input])
        setRecentPrompt(input)
        response = await runChat(input)
      }
   
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord+" ");
      }
    //   setResultData(newResponseArray);
      setLoading(false);
      setInput("");
    } catch (e) {
      return console.log("🥯", e);
    }
  };

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
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
