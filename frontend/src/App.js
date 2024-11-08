import ReactMarkdown from "react-markdown";
import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import "./index.css";

//APP
const App = () => {
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [vlr_link, setVLR_LINK] = useState("");
  const [answerHistory, setAnswerHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const answerRef = useRef(null);

  useEffect(() => {
    answerRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [answerHistory]);

  const getResponse = async () => {
    setAnswer("");
    if (!vlr_link || !vlr_link.startsWith("https://www.vlr.gg/")) {
      setError("Error! Please provide a VLR.gg link, click again to clear");
      return;
    }
    if (!value) {
      setError("Error! Please ask a question, click again to clear");
      return;
    }
    try {
      setIsLoading(true);
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          url: vlr_link,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("https://valorai-server.onrender.com/gemini", options);
      const data = await response.text();
      setAnswer(data);
      setValue("");
      setVLR_LINK("");
      setAnswerHistory((oldAnswerHistory) => [...oldAnswerHistory, data]);
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Try again later.");
    }
    setIsLoading(false);
  };

  const clear = () => {
    setValue("");
    setVLR_LINK("");
    setError("");
  };

  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();

      t1.from("#title-1", {
          yPercent: "-10",
          opacity: 0,
          delay: 0.8
        })
        .from("#title-2", {
          yPercent: "-10",
          opacity: 0,
        })
        .from("#title-3", {
          yPercent: "-10",
          opacity: 0,
        })
        .to("#title-1", {
          yPercent: "10",
          opacity: 0,
          delay: 1,
        })
        .to("#title-2", {
          yPercent: "10",
          opacity: 0,
        })
        .to("#title-3", {
          yPercent: "10",
          opacity: 0,
        })
        .to("#intro-slider", {
          yPercent: "100",
          duration: 1,
          delay: 0.2,
        })
        .set("#intro-slider", {
          yPercent: "-100"
        })
        .from("#welcome-title", {
          delay: 0.5,
          opacity: 0,
        })
        .to("#welcome-title", {
          opacity: 0,
          delay: 2,
        })
        .from("#valor-ai", {
          opacity: 0,
          delay: 0.3
        })
    }, comp);

    return () => ctx.revert();
  }, []);
  
  return (
    <div className="App">
      <div className="relative" ref={comp}>
        
        <div
          id="intro-slider"
          className="h-full bg-gradient-to-bl from-black to-zinc-950 absolute top-0 left-0 w-full flex-column justify-center"
        >
          <h1 id="title-1" className="text-9xl text-[#981b1b] p-5">
            Professional Valorant,
          </h1>
          <h1 id="title-2" className="text-9xl text-[#981b1b] p-5">
            easier and more accessible
          </h1>
          <h1 id="title-3" className="text-9xl text-[#981b1b] p-5">
            than ever before
          </h1>
        </div>
        <div
          id="welcome-slider"
          className="flex-column bg-gradient-to-br from-red-950 to-rose-900 justify-center place-items-center w-full h-full"
        >
          <div
            id="welcome-title"
            className="text-9xl text-center items-center font-bold text-gray-100 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] drop-shadow-md"
          >
            <h1>Welcome to ValorAI</h1>
          </div>
          <section className="search-section" id="valor-ai">
            <div className="search-results">
              <div className="result-box">
                {answerHistory.length == 0 && (
                  <p className="emptyText">
                    <ReactMarkdown>Welcome to Valor AI, powered by Gemini, get started by providing a **VLR.gg** link and entering a question.</ReactMarkdown>
                  </p>
                )}
                <ul ref={answerRef}>
                  {answerHistory.map((answer, _index) => (
                    <p className="valor-responses"key={_index}>
                      <img className="w-12 h-12" src={require("./valorai.png")}></img>
                      <div className="flex flex-col mt-auto mb-auto ml-8">
                        <ReactMarkdown>
                          {answer}
                        </ReactMarkdown>
                      </div>
                    </p>
                  ))}
                </ul>
              </div>
            </div>
            <div className="input-container">
              <input
                value={vlr_link}
                placeholder="Enter a VLR.gg Link"
                onChange={(e) => setVLR_LINK(e.target.value)}
              />
              <input
                value={value}
                placeholder={"Ask a question about this VLR.gg page"}
                onChange={(e) => setValue(e.target.value)}
              />
              {!error && <button onClick={!isLoading ? getResponse : null}>{isLoading ? "Generating Response ..." : "Submit"}</button>}
              {error && <button onClick={clear}>{error}</button>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;
