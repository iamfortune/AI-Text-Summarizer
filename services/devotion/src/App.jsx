import { useState, useCallback, useEffect } from "react";
import { useFetchPrompt, handlePromptSubmit, handleKeyDown } from "./utils.js";
import { toast, Toaster } from "react-hot-toast";
import "./App.css";

const App = () => {
  const {
    prompt,
    setPrompt,
    response,
    setResponse,
    loading,
    setLoading,
  } = useFetchPrompt();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = useCallback(() => {
    handlePromptSubmit(prompt, setResponse, setLoading);
  }, [prompt, setResponse, setLoading]);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(response)
      .then(() => {
        toast.success("Summary copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy summary to clipboard.");
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const username = query.get("username");
    const fullname = query.get("fullname");
    const image = query.get("image");
    const email = query.get("email");

    if (token) {
      setIsAuthenticated(true);
      setUser({ username, fullname, image, email });
    }
  }, []);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_AI_URL}/login/github`;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-4">AI Text Summarizer</h1>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={handleLogin}
          >
            Login with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto p-2 text-center bg-white rounded-lg shadow-lg">
        <Toaster />
        <div className="mb-4">
          <textarea
            className="w-full p-3 border rounded-lg text-lg"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
            placeholder="Enter text to summarize..."
            rows="10"
          />
        </div>
        <button
          className={`px-4 py-2 text-white rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
        {response && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Summary</h2>
            <div className="border p-4 rounded-lg bg-gray-100 text-left">
              <p className="text-lg">{response}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
