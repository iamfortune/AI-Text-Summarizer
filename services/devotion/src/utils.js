import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { prompt as apiPrompt, setBaseUrl } from "../summary.mjs";

setBaseUrl(import.meta.env.VITE_AI_URL);

export const useFetchPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrompt = useCallback(async (userPrompt) => {
    setLoading(true);

    try {
      const fetchedPrompt = await apiPrompt({ prompt: userPrompt });
      setPrompt(userPrompt);
      const responses = [...response, fetchedPrompt.response];
      console.log(responses);
      setResponse(fetchedPrompt.response);
      toast.success("Prompt fetched successfully!");
    } catch (error) {
      console.error("Failed to load prompt:", error);
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prompt,
    setPrompt,
    response,
    setResponse,
    fetchPrompt,
    loading,
    setLoading,
  };
};

export const handlePromptSubmit = async (prompt, setResponse, setLoading) => {
  setLoading(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      setResponse(`Error: ${errorResponse.message} (${res.status})`);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let completeResponse = "";

    let loading = true;
    while (loading) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedValue = decoder.decode(value, { stream: true });
      const lines = decodedValue.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("event: ")) {
          const eventType = line.substring("event: ".length);
          const dataLine = lines[++i];
          if (dataLine.startsWith("data: ")) {
            const data = dataLine.substring("data: ".length);
            const json = JSON.parse(data);
            if (eventType === "content") {
              completeResponse += json.response;
            } else if (eventType === "error") {
              setResponse(`Error: ${json.message} (${json.code})`);
              return;
            }
          }
        }
      }
    }

    setResponse(completeResponse);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    setResponse("Failed to fetch data.");
  } finally {
    setLoading(false);
  }
};

export const handleKeyDown = (event, handlePromptSubmitCallback) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handlePromptSubmitCallback();
  }
};
