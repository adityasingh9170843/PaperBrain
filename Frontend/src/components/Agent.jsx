

import { useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { Upload, Send, FileText, Bot, User, Zap } from "lucide-react"

function ChatMessage({ message, isUser = false }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30"
              : "bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/20"
          }`}
        >
          {isUser ? <User className="w-4 h-4 text-red-400" /> : <Bot className="w-4 h-4 text-red-400" />}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 text-red-50"
              : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 text-slate-100"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default function ChatUI() {
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [conversationID] = useState(() => Date.now().toString(36) + Math.random().toString(36).substring(2, 8))
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      text: "Hello! Upload a PDF and ask me anything about it. I'm your AI document assistant powered by advanced RAG technology.",
      isUser: false,
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("pdf", file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)

      await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: `PDF "${file.name}" has been successfully processed and indexed! You can now ask me questions about its content.`,
            isUser: false,
          },
        ])
        setUploadProgress(0)
        setIsUploading(false)
        setFile(null)
      }, 500)
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          text: "Error uploading PDF. Please try again.",
          isUser: false,
        },
      ])
      setUploadProgress(0)
      setIsUploading(false)
    }
  }

  const handleSend = async () => {
    if (!message.trim()) return

    const userMsg = { text: message, isUser: true }
    setMessages((prev) => [...prev, userMsg])
    setMessage("")
    setIsTyping(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message,
        conversationId: conversationID,
      })

      const botMsg = { text: res.data.answer, isUser: false }
      setMessages((prev) => [...prev, botMsg])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [...prev, { text: "Error: Could not get response. Please try again.", isUser: false }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-600/10 to-orange-500/10 rounded-full blur-3xl animate-bounce"
          style={{ animationDuration: "6s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-red-500/5 to-transparent rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>

        
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/60 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 left-3/4 w-1 h-1 bg-pink-400/60 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-400/40 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-red-300/50 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "3s" }}
        ></div>

      
        <div
          className="absolute top-10 right-10 w-16 h-16 border border-red-500/20 rotate-45 animate-spin"
          style={{ animationDuration: "15s" }}
        ></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 border-2 border-pink-500/30 rounded-full animate-pulse"></div>

        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-pink-500/15 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

     
      <div
        className="absolute inset-0 opacity-[0.03] animate-pulse"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(239 68 68) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
          animationDuration: "4s",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
     
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 ">
              <Zap className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent ">
              PaperBrain
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Advanced document intelligence powered by retrieval-augmented generation
          </p>
        </div>

        
        <Card className="mb-6 bg-slate-900/90 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/95 transition-all duration-300">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 text-slate-100">
              <FileText className="w-5 h-5 text-red-400 " />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="flex-1 bg-slate-800/50 border-slate-600/50 text-slate-100 file:bg-red-500/20 file:text-red-400 file:px-2 file:border-red-500/30 hover:bg-slate-800/70 transition-colors"
                disabled={isUploading}
              />
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 hover:scale-105 transition-transform"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Processing..." : "Upload"}
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Processing document...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-slate-800" />
              </div>
            )}

            {file && !isUploading && (
              <Badge variant="outline" className="border-red-500/30 text-red-400 animate-pulse">
                Selected: {file.name}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card className="bg-slate-900/90 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/95 transition-all duration-300">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2 p- text-slate-100">
              <Bot className="w-5 h-5 text-red-400" />
              AI Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 mb-4 p-4 rounded-lg bg-slate-950/30 border border-slate-800/50">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <span className="ml-2 text-slate-400 text-sm">AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-3">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about your document..."
                className="flex-1 bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder:text-slate-500 hover:bg-slate-800/70 focus:bg-slate-800/80 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
