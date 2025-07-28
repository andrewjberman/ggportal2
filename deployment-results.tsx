"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

interface DeploymentResultsProps {
  deployment: any
  results: any
  onClose: () => void
  onAddToPortfolio: () => void
}

export const DeploymentResults = ({ deployment, results, onClose, onAddToPortfolio }: DeploymentResultsProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [queryText, setQueryText] = useState("")
  const [notes, setNotes] = useState([])

  const addNote = (content: string) => {
    const note = {
      id: Date.now(),
      content,
      author: "user@email.com",
      timestamp: new Date(),
      tags: content.match(/#\w+/g) || [],
    }
    setNotes([note, ...notes])
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4"
            >
              ← Back to contractor
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{deployment.title}</h2>
                <p className="text-gray-400">
                  {deployment.contractor.name} •{deployment.status === "running" ? " Running..." : " Completed"} •
                  {new Date(deployment.startTime).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onAddToPortfolio}
                  variant="outline"
                  style={{ borderColor: "#D2AC38", color: "#D2AC38" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save to Portfolio
                </Button>
                <Button variant="outline" style={{ borderColor: "#666", color: "#999" }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-6">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-yellow-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "analysis"
                    ? "border-yellow-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {deployment.title}
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-yellow-600 transition-colors ml-auto">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {deployment.status === "running" ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Running analysis...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && results && (
                <div className="space-y-6">
                  <div
                    className="rounded-lg border p-6"
                    style={{
                      backgroundColor: "#0F0F0F",
                      borderColor: "#333",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
                    <p className="text-gray-300 leading-relaxed">{results.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(results.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border p-6"
                        style={{
                          backgroundColor: "#0F0F0F",
                          borderColor: "#333",
                        }}
                      >
                        <p className="text-sm text-gray-400 mb-2 capitalize">{key}</p>
                        <p className="text-2xl font-bold text-white">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "analysis" && (
                <div className="space-y-6">
                  {/* Charts Placeholder */}
                  <div
                    className="rounded-lg border p-6"
                    style={{
                      backgroundColor: "#0F0F0F",
                      borderColor: "#333",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Time Series Analysis</h3>
                    <div
                      className="h-64 rounded flex items-center justify-center"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <span className="text-gray-500">Chart Visualization</span>
                    </div>
                  </div>

                  <div
                    className="rounded-lg border p-6"
                    style={{
                      backgroundColor: "#0F0F0F",
                      borderColor: "#333",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Cross-Section Comparison</h3>
                    <div
                      className="h-64 rounded flex items-center justify-center"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <span className="text-gray-500">Comparison Table</span>
                    </div>
                  </div>

                  {/* Query Interface */}
                  <div
                    className="rounded-lg border p-4"
                    style={{
                      backgroundColor: "#0F0F0F",
                      borderColor: "#333",
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Refine this analysis:</p>
                    <textarea
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="Ask a follow-up question or request modifications..."
                      className="w-full bg-transparent text-white resize-none focus:outline-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Press ⌘+Enter to submit</span>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#D2AC38", color: "#000" }}
                        disabled={!queryText.trim()}
                      >
                        Run Query
                      </Button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Notes & Observations</h3>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Add a note... Use #tags to categorize"
                        className="w-full p-3 rounded border bg-gray-900 border-gray-800 text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                            addNote((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="p-3 rounded" style={{ backgroundColor: "#1A1A1A" }}>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{note.author}</span>
                            <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-white">{note.content}</p>
                          {note.tags.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {note.tags.map((tag) => (
                                <span key={tag} className="text-xs text-yellow-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
