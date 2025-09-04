import React, { useEffect, useState } from "react";
import image from "../assets/image.png";
import { useNavigate } from "react-router-dom";

function Ai() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false); // track listening state

  // Speak function
  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  // Setup speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true); // 🎤 started listening
    };

    recognition.onend = () => {
      setListening(false); // 🎤 stopped listening
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log("User said:", transcript);

      // Commands with variations
      const commands = [
        { variations: [["dashboard"]], path: "/ai", message: "Opening dashboard" },
        { variations: [["write", "article"], ["article"]], path: "/ai/write-article", message: "Opening write article" },
        { variations: [["blog", "titles"], ["blog", "title"],["block", "title"]], path: "/ai/blog-titles", message: "Opening blog titles" },
        { variations: [["generate", "images"], ["generate", "image"]], path: "/ai/generate-images", message: "Opening generate images" },
        { variations: [["remove", "background"], ["background"]], path: "/ai/remove-background", message: "Opening remove background" },
        { variations: [["remove", "object"], ["delete", "object"], ["object"]], path: "/ai/remove-object", message: "Opening remove object" },
        { variations: [["review", "resume"], ["resume"]], path: "/ai/review-resume", message: "Opening review resume" },
        { variations: [["community"]], path: "/ai/community", message: "Opening community" },
        { variations: [["home","page"]], path: "/", message: "Going home" },
      ];

      let matched = false;
      for (let cmd of commands) {
        for (let variation of cmd.variations) {
          if (variation.every((word) => transcript.includes(word))) {
            speak(cmd.message);
            navigate(cmd.path);
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      if (!matched) {
        speak("Sorry, I did not understand that command.");
      }
    };
  }, [recognition, navigate]);

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] right-[2%]"
      onClick={() => recognition && recognition.start()}
    >
      <img
        src={image}
        alt="AI Bot"
        className={`w-[100px] cursor-pointer transition-all duration-300 ${
          listening ? "animate-pulse drop-shadow-[0_0_15px_purple]" : ""
        }`}
      />
    </div>
  );
}

export default Ai;
