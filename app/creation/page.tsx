"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, List, Send, Trash2, HelpCircle } from "lucide-react";
import {
  useCreateQuestionPaperMutation,
  useGetMyQuestionPapersQuery,
} from "@/redux/features/questionPaper/questionPaper.api";
import { Button } from "@/components/ui/button";

import { toast } from "react-hot-toast";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function CreationPage() {
  const [activeTab, setActiveTab] = useState<"create" | "all">("create");
  const [examName, setExamName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);

  const { data: myPapers, isLoading: loadingPapers } =
    useGetMyQuestionPapersQuery(undefined);
  const [createPaper, { isLoading: isCreating }] =
    useCreateQuestionPaperMutation();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string,
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectIndexChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!examName.trim()) return toast.error("Please enter exam name");
    if (
      questions.some(
        (q) => !q.question.trim() || q.options.some((o) => !o.trim()),
      )
    ) {
      return toast.error("Please fill all questions and options");
    }

    try {
      await createPaper({
        examName,
        questions,
      }).unwrap();
      toast.success("Question Paper created successfully!");
      setExamName("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
      setActiveTab("all");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create question paper");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-32 pt-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2"
          >
            Question Workshop
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Create and manage your competitive exams
          </p>
        </header>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "create"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Create
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <List className="w-4 h-4" />
            My Papers
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "create" ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800">
                <div className="mb-8">
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g., BCS Preli 2024"
                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-8">
                  {questions.map((q, qIndex) => (
                    <motion.div
                      key={qIndex}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 relative group"
                    >
                      <button
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="mb-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 ml-1">
                          Question {qIndex + 1}
                        </label>
                        <textarea
                          value={q.question}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, e.target.value)
                          }
                          placeholder="Type your question here..."
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 outline-none transition-all resize-none h-24"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="relative">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                handleOptionChange(
                                  qIndex,
                                  oIndex,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${oIndex + 1}`}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border transition-all outline-none ${
                                q.correctIndex === oIndex
                                  ? "border-green-500 ring-2 ring-green-500/10"
                                  : "border-zinc-200 dark:border-zinc-800"
                              }`}
                            />
                            <button
                              onClick={() =>
                                handleCorrectIndexChange(qIndex, oIndex)
                              }
                              className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                q.correctIndex === oIndex
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-zinc-300 dark:border-zinc-700 hover:border-green-500"
                              }`}
                            >
                              {q.correctIndex === oIndex && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                              <span className="sr-only">Set as correct</span>
                            </button>
                            <span className="absolute left-10 text-[10px] bottom-0 font-bold opacity-0 transition-all text-green-600">
                              Correct
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={handleAddQuestion}
                    variant="outline"
                    className="flex-1 py-6 rounded-2xl border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 group"
                  >
                    <PlusCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Add Another Question
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className="flex-1 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20"
                  >
                    {isCreating ? (
                      "Saving..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Finalize & Create Paper
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {loadingPapers ? (
                <div className="text-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-zinc-500">Loading your creations...</p>
                </div>
              ) : myPapers?.length === 0 ? (
                <div className="text-center bg-white dark:bg-zinc-900 p-20 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl">
                  <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Papers Found</h3>
                  <p className="text-zinc-500 mb-8">
                    You haven't created any question papers yet.
                  </p>
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="bg-blue-600 text-white px-8 h-12 rounded-xl"
                  >
                    Create Your First Paper
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {myPapers?.map((paper: any) => (
                    <motion.div
                      key={paper._id}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {paper.examName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                            {paper.questionIds.length} Questions
                          </span>
                          <span>
                            Created:{" "}
                            {new Date(paper.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-xl px-6 h-12"
                        >
                          View
                        </Button>
                        <Button className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl px-6 h-12">
                          Edit
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
