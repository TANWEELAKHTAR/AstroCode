"use client";
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import Link from "next/link";

// Define TypeScript interfaces
interface ReviewResponse {
  data: string;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>(
    `// Enter your TypeScript code here...`
  );
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [error, setError] = useState<string>("");
  const [mobileView, setMobileView] = useState<"editor" | "review">("editor");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedCode", code);
  }, [code]);

  useEffect(() => {
    if (review && isMobile) {
      setMobileView("review");
    }
  }, [review, isMobile]);

  async function reviewCode(): Promise<void> {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<ReviewResponse>(
        "http://localhost:3000/ai/get-review",
        {
          code,
          language,
        }
      );
      setReview(response.data.toString());
    } catch (error) {
      console.error("Error fetching review:", error);
      setError(
        "Failed to fetch review. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const getLanguageHighlighter = (code: string): string => {
    try {
      return highlight(
        code,
        languages[language] || languages.typescript,
        language
      );
    } catch (error) {
      return highlight(code, languages.typescript, "typescript");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Header with controls - Responsive */}
      <header
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b ${
          theme === "dark"
            ? "bg-grey-800 border-gray-700"
            : "bg-gray-200 border-gray-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto mb-2 sm:mb-0">
            
          <Link href={"/"} className="w-full flex justify-center"><img className="h-8 sm:h-6 mr-2 my-6 sm:my-0" src="/images/AstroCode.svg" alt="" /></Link>
          <div className="flex items-center mb-2 sm:mb-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mr-2 bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="">Select language</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
              <option value="python">Python</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`text-sm px-3 py-1 rounded ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          {isMobile && (
            <div className="flex mr-2 bg-gray-700 rounded overflow-hidden">
              <button
                onClick={() => setMobileView("editor")}
                className={`px-3 py-1 text-sm ${
                  mobileView === "editor"
                    ? "bg-[#6E27E0] text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobileView("review")}
                className={`px-3 py-1 text-sm ${
                  mobileView === "review"
                    ? "bg-[#6E27E0] text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                Review
              </button>
            </div>
          )}

          <button
            onClick={reviewCode}
            disabled={loading || !code.trim()}
            className={`py-1 px-4 rounded-md text-sm font-medium flex-grow sm:flex-grow-0 ${
              loading || !code.trim()
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-[#6E27E0] text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </header>

      {/* Main content area - Responsive */}
      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Editor panel */}
        <div
          className={`${
            isMobile && mobileView !== "editor" ? "hidden" : "flex"
          } 
        md:flex md:w-1/2 border-r border-gray-700 flex-col flex-1`}
        >
          <div
            className={`px-4 py-2 text-xs flex justify-between items-center ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <span>{language.toUpperCase()} EDITOR</span>
            <span className="md:hidden">{code.split("\n").length} lines</span>
          </div>
          <div className="flex-1 overflow-auto">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={getLanguageHighlighter}
              padding={16}
              style={{
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: isMobile ? 12 : 14,
                height: "100%",
                backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                color: theme === "dark" ? "#D4D4D4" : "#1E1E1E",
              }}
              className="min-h-full"
            />
          </div>
          <div
            className={`hidden md:flex justify-between items-center px-4 py-1 text-xs ${
              theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <span>{code.split("\n").length} lines</span>
            <span>{code.length} characters</span>
          </div>
        </div>

        {/* Review panel */}
        <div
          className={`${
            isMobile && mobileView !== "review" ? "hidden" : "flex"
          } 
        md:flex md:w-1/2 flex-col flex-1`}
        >
          <div
            className={`px-4 py-2 text-xs flex justify-between ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <span>CODE REVIEW</span>
            {loading && <span>Analyzing...</span>}
          </div>
          <div
            className={`flex-1 p-4 overflow-auto ${
              theme === "dark"
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-800"
            }`}
          >
            {error ? (
              <div className="text-red-400 p-2 rounded bg-red-900 bg-opacity-30 mb-4">
                {error}
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
              </div>
            ) : review ? (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-500 h-full flex items-center justify-center">
                <div className="text-center px-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                  <p className="text-sm sm:text-base">
                    Click "Review Code" to get an AI-powered analysis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-1 px-4 text-xs flex justify-between items-center ${
          theme === "dark"
            ? "bg-gray-800 text-gray-400 border-t border-gray-700"
            : "bg-gray-200 text-gray-600 border-t border-gray-300"
        }`}
      >
        <span className="truncate">CodeReviewer v1.0</span>
        <div className="flex items-center">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              loading ? "bg-yellow-400" : "bg-green-400"
            }`}
          ></span>
          <span>{loading ? "Processing" : "Ready"}</span>
        </div>
      </footer>

      {/* Mobile floating action button to toggle between views */}
      {isMobile && (
        <button
          onClick={() =>
            setMobileView(mobileView === "editor" ? "review" : "editor")
          }
          className="fixed bottom-16 right-4 bg-[#6E27E0] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
        >
          {mobileView === "editor" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default App;
