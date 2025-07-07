"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, User, Target, Users, Settings } from "lucide-react"

interface Analysis {
  id: string
  challenge: string
  quadrants: {
    upperLeft: string
    upperRight: string
    lowerLeft: string
    lowerRight: string
  }
  insights: string
  actionPlan: string
  createdAt: Date
  completed: boolean
}

const QUADRANTS = [
  {
    id: "upperLeft",
    title: "Your Inner World",
    subtitle: "Individual Interior (I)",
    icon: User,
    description: "Your thoughts, feelings, beliefs, and inner experience",
    questions: [
      "What emotions are you experiencing about this challenge?",
      "What beliefs or assumptions might be influencing your perspective?",
      "What fears or hopes do you have related to this situation?",
      "How does this challenge align with your personal values?",
    ],
  },
  {
    id: "upperRight",
    title: "Your Actions & Behaviors",
    subtitle: "Individual Exterior (It)",
    icon: Target,
    description: "Observable behaviors, actions, and physical aspects",
    questions: [
      "What specific actions have you taken so far?",
      "What skills or resources do you currently have?",
      "What measurable outcomes are you seeking?",
      "What physical or practical constraints exist?",
    ],
  },
  {
    id: "lowerLeft",
    title: "Relationships & Culture",
    subtitle: "Collective Interior (We)",
    icon: Users,
    description: "Shared meanings, relationships, and cultural context",
    questions: [
      "How do your relationships influence this situation?",
      "What cultural or social expectations are at play?",
      "Who else is affected by this challenge?",
      "What shared values or norms are relevant?",
    ],
  },
  {
    id: "lowerRight",
    title: "Systems & Environment",
    subtitle: "Collective Exterior (Its)",
    icon: Settings,
    description: "Systems, structures, and environmental factors",
    questions: [
      "What organizational or systemic factors are involved?",
      "How does the broader environment affect this situation?",
      "What processes or structures need to be considered?",
      "What external forces or trends are relevant?",
    ],
  },
]

export default function AQALExplorer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [challenge, setChallenge] = useState("")
  const [quadrantData, setQuadrantData] = useState({
    upperLeft: "",
    upperRight: "",
    lowerLeft: "",
    lowerRight: "",
  })
  const [insights, setInsights] = useState("")
  const [actionPlan, setActionPlan] = useState("")
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aqal-analyses")
    if (saved) {
      setAnalyses(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("aqal-analyses", JSON.stringify(analyses))
  }, [analyses])

  const totalSteps = 6 // Challenge + 4 Quadrants + Synthesis
  const progress = (currentStep / (totalSteps - 1)) * 100

  const currentQuadrant = currentStep >= 1 && currentStep <= 4 ? QUADRANTS[currentStep - 1] : null
  const CurrentIcon = currentQuadrant ? currentQuadrant.icon : null

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleQuadrantChange = (quadrantId: string, value: string) => {
    setQuadrantData((prev) => ({
      ...prev,
      [quadrantId]: value,
    }))
  }

  const handleComplete = () => {
    const newAnalysis: Analysis = {
      id: Date.now().toString(),
      challenge,
      quadrants: quadrantData,
      insights,
      actionPlan,
      createdAt: new Date(),
      completed: true,
    }

    setAnalyses((prev) => [newAnalysis, ...prev])

    // Reset form
    setCurrentStep(0)
    setChallenge("")
    setQuadrantData({
      upperLeft: "",
      upperRight: "",
      lowerLeft: "",
      lowerRight: "",
    })
    setInsights("")
    setActionPlan("")
    setShowHistory(true)
  }

  const startNewAnalysis = () => {
    setShowHistory(false)
    setCurrentStep(0)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return challenge.trim().length > 0
      case 1:
        return quadrantData.upperLeft.trim().length > 0
      case 2:
        return quadrantData.upperRight.trim().length > 0
      case 3:
        return quadrantData.lowerLeft.trim().length > 0
      case 4:
        return quadrantData.lowerRight.trim().length > 0
      case 5:
        return insights.trim().length > 0 && actionPlan.trim().length > 0
      default:
        return false
    }
  }

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Analyses</h1>
              <p className="text-gray-600 mt-2">Review your past explorations and insights</p>
            </div>
            <Button onClick={startNewAnalysis} size="lg">
              New Analysis
            </Button>
          </div>

          {analyses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No analyses yet. Start your first exploration!</p>
                <Button onClick={startNewAnalysis}>Begin Your First Analysis</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{analysis.challenge}</CardTitle>
                        <CardDescription>{analysis.createdAt.toLocaleDateString()}</CardDescription>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Key Insights</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{analysis.insights}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Action Plan</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{analysis.actionPlan}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AQAL Explorer</h1>
          <p className="text-gray-600">Transform complexity into clarity through structured reflection</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 0: Challenge Definition */}
        {currentStep === 0 && (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Define Your Challenge</CardTitle>
              <CardDescription className="text-lg">
                What problem or goal is on your mind? Be specific and honest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the challenge, decision, or goal you want to explore..."
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="min-h-32 text-lg resize-none"
                autoFocus
              />
            </CardContent>
          </Card>
        )}

        {/* Steps 1-4: Quadrant Exploration */}
        {currentStep >= 1 && currentStep <= 4 && (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {CurrentIcon && <CurrentIcon className="w-8 h-8 text-blue-600 mr-3" />}
                <div>
                  <CardTitle className="text-2xl">{QUADRANTS[currentStep - 1].title}</CardTitle>
                  <CardDescription className="text-lg">{QUADRANTS[currentStep - 1].subtitle}</CardDescription>
                </div>
              </div>
              <p className="text-gray-600">{QUADRANTS[currentStep - 1].description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Consider these questions:</h3>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  {QUADRANTS[currentStep - 1].questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>

              <Textarea
                placeholder="Reflect on this perspective and write your thoughts..."
                value={quadrantData[QUADRANTS[currentStep - 1].id as keyof typeof quadrantData]}
                onChange={(e) => handleQuadrantChange(QUADRANTS[currentStep - 1].id, e.target.value)}
                className="min-h-40 text-lg resize-none"
                autoFocus
              />
            </CardContent>
          </Card>
        )}

        {/* Step 5: Synthesis & Action Plan */}
        {currentStep === 5 && (
          <div className="space-y-8">
            {/* Synthesis Dashboard */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Four Perspectives</CardTitle>
                <CardDescription>Review your reflections from all quadrants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Your Challenge:</h3>
                  <p className="text-gray-800">{challenge}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {QUADRANTS.map((quadrant, index) => (
                    <div key={quadrant.id} className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        {(() => {
                          const Icon = quadrant.icon
                          return Icon ? <Icon className="w-5 h-5 text-blue-600 mr-2" /> : null
                        })()}
                        <h3 className="font-medium text-gray-800">{quadrant.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {quadrantData[quadrant.id as keyof typeof quadrantData] || "No reflection added"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Synthesis Questions */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Synthesis & Action</CardTitle>
                <CardDescription>Transform your reflections into insights and concrete next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Key Insights</label>
                  <p className="text-sm text-gray-600 mb-3">
                    Looking at these four perspectives, what are the 1-3 most important realizations you've had? What
                    are the common threads or contradictions?
                  </p>
                  <Textarea
                    placeholder="Write your key insights here..."
                    value={insights}
                    onChange={(e) => setInsights(e.target.value)}
                    className="min-h-32 text-lg resize-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Action Plan</label>
                  <p className="text-sm text-gray-600 mb-3">
                    What is one small, concrete step you can take in the next 72 hours based on these insights?
                  </p>
                  <Textarea
                    placeholder="Write your specific action plan here..."
                    value={actionPlan}
                    onChange={(e) => setActionPlan(e.target.value)}
                    className="min-h-32 text-lg resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {analyses.length > 0 && (
            <Button variant="ghost" onClick={() => setShowHistory(true)}>
              View History
            </Button>
          )}

          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete & Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
