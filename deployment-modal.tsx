"use client"
import { BarChart3, Activity, Building2, Globe } from "lucide-react"

interface DeploymentModalProps {
  contractor: any
  onClose: () => void
  onDeploy: (option: any) => void
}

export const DeploymentModal = ({ contractor, onClose, onDeploy }: DeploymentModalProps) => {
  const deploymentOptions = [
    {
      id: "revenue-analytics",
      title: "Revenue Analytics",
      description: "Pipeline valuation, growth patterns, competitive positioning",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      id: "forensic-diligence",
      title: "Forensic Due Diligence",
      description: "Relationship mapping, anomaly detection, performance risk",
      icon: <Activity className="w-6 h-6" />,
    },
    {
      id: "agency-exposure",
      title: "Agency Exposure",
      description: "Agency concentration, budget availability, trend monitoring",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: "market-perception",
      title: "Market Perception",
      description: "Media events, sentiment tracking, tonality shifts",
      icon: <Globe className="w-6 h-6" />,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Deploy Analysis for {contractor.name}</h2>
          <p className="text-gray-400 mt-1">Choose an analysis to run</p>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deploymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onDeploy(option)}
                className="p-6 text-left rounded-lg border hover:border-yellow-600 transition-all group"
                style={{
                  backgroundColor: "#0F0F0F",
                  borderColor: "#333",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#1A1A1A" }}
                  >
                    <span style={{ color: "#D2AC38" }}>{option.icon}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-white">{option.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">{option.description}</p>
                <span className="text-sm text-yellow-600 group-hover:text-yellow-500 transition-colors">
                  Deploy this analysis →
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
