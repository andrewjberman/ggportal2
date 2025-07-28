"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  TrendingUp,
  Building2,
  Shield,
  Cpu,
  Activity,
  Target,
  ChevronRight,
  BarChart3,
  Globe,
  Filter,
  X,
  ArrowUp,
  Download,
  Check,
  GripVertical,
} from "lucide-react"
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog";

// Horizontal Filter Bar Component
const FilterBar = ({
  activeFilters,
  setActiveFilters,
  handleFilterChange,
  openFilter,
  setOpenFilter,
  contractValueMin,
  setContractValueMin,
  contractValueMax,
  setContractValueMax,
}) => {
  // Convert linear slider position to exponential contract value
  const positionToValue = (position) => {
    if (position <= 30) {
      // 0-30% of slider = $0-$100M (linear)
      return (position / 30) * 0.1 // 0 to 0.1B
    } else if (position <= 60) {
      // 30-60% of slider = $100M-$1B (linear)
      return 0.1 + ((position - 30) / 30) * 0.9 // 0.1B to 1B
    } else if (position <= 85) {
      // 60-85% of slider = $1B-$10B (linear)
      return 1 + ((position - 60) / 25) * 9 // 1B to 10B
    } else {
      // 85-100% of slider = $10B-$100B+ (exponential)
      return 10 + ((position - 85) / 15) * 90 // 10B to 100B+
    }
  }

  // Format value for display
  const formatValue = (value) => {
    if (value < 0.001) return "$0"
    if (value < 0.01) return `$${(value * 1000).toFixed(0)}M`
    if (value < 0.1) return `$${(value * 100).toFixed(0)}0M`
    if (value < 1) return `$${(value * 1000).toFixed(0)}M`
    if (value < 10) return `$${value.toFixed(1)}B`
    if (value >= 100) return "$100B+"
    return `$${value.toFixed(0)}B`
  }

  const filterConfigs = [
    {
      id: "location",
      label: "Location",
      icon: <Globe className="w-3 h-3" />,
      hasActive: activeFilters.location.length > 0 || activeFilters.states.length > 0,
      activeCount: activeFilters.location.length + activeFilters.states.length,
    },
    {
      id: "sector",
      label: "Industry",
      icon: <Building2 className="w-3 h-3" />,
      hasActive: activeFilters.sector.length > 0,
      activeCount: activeFilters.sector.length,
    },
    {
      id: "contractValue",
      label: "Awards",
      icon: <BarChart3 className="w-3 h-3" />,
      hasActive: contractValueMin > 0 || contractValueMax < 100,
      activeCount: contractValueMin > 0 || contractValueMax < 100 ? 1 : 0,
    },
    {
      id: "lifecycle",
      label: "Lifecycle",
      icon: <TrendingUp className="w-3 h-3" />,
      hasActive: activeFilters.lifecycleStage.length > 0,
      activeCount: activeFilters.lifecycleStage.length,
    },
    {
      id: "momentum",
      label: "Momentum",
      icon: <Activity className="w-3 h-3" />,
      hasActive: activeFilters.businessMomentum.length > 0,
      activeCount: activeFilters.businessMomentum.length,
    },
    {
      id: "ownership",
      label: "Ownership",
      icon: <Building2 className="w-3 h-3" />,
      hasActive: activeFilters.ownership.length > 0,
      activeCount: activeFilters.ownership.length,
    },
  ]

  const handleFilterClick = (filterId) => {
    setOpenFilter(openFilter === filterId ? null : filterId)
  }

  const renderFilterContent = (filterId) => {
    switch (filterId) {
      case "location":
        return (
          <div className="p-4 space-y-4" style={{ backgroundColor: "#1A1A1A" }}>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="location"
                    checked={activeFilters.location.includes("US")}
                    onChange={() => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        location: ["US"],
                        states: [],
                      }))
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      activeFilters.location.includes("US")
                        ? "bg-yellow-500 border-yellow-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.location.includes("US") && (
                      <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.25 left-1.25"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  United States
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="location"
                    checked={activeFilters.location.includes("International")}
                    onChange={() => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        location: ["International"],
                        states: [],
                      }))
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      activeFilters.location.includes("International")
                        ? "bg-yellow-500 border-yellow-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.location.includes("International") && (
                      <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.25 left-1.25"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  International
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="location"
                    checked={activeFilters.location.length === 0}
                    onChange={() => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        location: [],
                        states: [],
                      }))
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      activeFilters.location.length === 0
                        ? "bg-yellow-500 border-yellow-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.location.length === 0 && (
                      <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.25 left-1.25"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  All Locations
                </span>
              </label>
            </div>

            {/* US States Multi-Select */}
            {activeFilters.location.includes("US") && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#0F0F0F" }}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-300 font-aptos">Select States</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const allStates = [
                          "AL",
                          "AK",
                          "AZ",
                          "AR",
                          "CA",
                          "CO",
                          "CT",
                          "DE",
                          "FL",
                          "GA",
                          "HI",
                          "ID",
                          "IL",
                          "IN",
                          "IA",
                          "KS",
                          "KY",
                          "LA",
                          "ME",
                          "MD",
                          "MA",
                          "MI",
                          "MN",
                          "MS",
                          "MO",
                          "MT",
                          "NE",
                          "NV",
                          "NH",
                          "NJ",
                          "NM",
                          "NY",
                          "NC",
                          "ND",
                          "OH",
                          "OK",
                          "OR",
                          "PA",
                          "RI",
                          "SC",
                          "SD",
                          "TN",
                          "TX",
                          "UT",
                          "VT",
                          "VA",
                          "WA",
                          "WV",
                          "WI",
                          "WY",
                          "DC",
                        ]
                        setActiveFilters((prev) => ({
                          ...prev,
                          states: allStates,
                        }))
                      }}
                      className="text-xs px-2 py-1 rounded border transition-colors font-aptos"
                      style={{ borderColor: "#D2AC38", color: "#D2AC38" }}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilters((prev) => ({
                          ...prev,
                          states: [],
                        }))
                      }}
                      className="text-xs px-2 py-1 rounded border transition-colors font-aptos"
                      style={{ borderColor: "#666", color: "#999" }}
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="max-h-24 overflow-y-auto">
                  <div className="grid grid-cols-6 gap-1">
                    {[
                      "AL",
                      "AK",
                      "AZ",
                      "AR",
                      "CA",
                      "CO",
                      "CT",
                      "DE",
                      "FL",
                      "GA",
                      "HI",
                      "ID",
                      "IL",
                      "IN",
                      "IA",
                      "KS",
                      "KY",
                      "LA",
                      "ME",
                      "MD",
                      "MA",
                      "MI",
                      "MN",
                      "MS",
                      "MO",
                      "MT",
                      "NE",
                      "NV",
                      "NH",
                      "NJ",
                      "NM",
                      "NY",
                      "NC",
                      "ND",
                      "OH",
                      "OK",
                      "OR",
                      "PA",
                      "RI",
                      "SC",
                      "SD",
                      "TN",
                      "TX",
                      "UT",
                      "VT",
                      "VA",
                      "WA",
                      "WV",
                      "WI",
                      "WY",
                      "DC",
                    ].map((state) => (
                      <label key={state} className="flex items-center gap-1 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={activeFilters.states.includes(state)}
                            onChange={() => handleFilterChange("states", state)}
                            className="sr-only"
                          />
                          <div
                            className={`w-2.5 h-2.5 rounded border transition-all ${
                              activeFilters.states.includes(state)
                                ? "bg-yellow-500 border-yellow-500"
                                : "border-gray-600 group-hover:border-yellow-500"
                            }`}
                          >
                            {activeFilters.states.includes(state) && (
                              <svg className="w-1.5 h-1.5 text-black absolute top-0.5 left-0.5" fill="currentColor">
                                <path d="M4 .5l-2.5 2.5-1-1-.5.5 1.5 1.5 3-3z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-aptos">
                          {state}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "sector":
        return (
          <div className="p-4" style={{ backgroundColor: "#1A1A1A" }}>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {[
                "Aerospace & Defense",
                "Agriculture",
                "Construction",
                "Education",
                "Energy",
                "Environmental",
                "Facilities Management",
                "Financial Services",
                "Healthcare",
                "Information Technology",
                "Manufacturing",
                "Professional Services",
                "Research & Development",
                "Telecommunications",
                "Transportation",
                "Other",
              ].map((sector) => (
                <label key={sector} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={activeFilters.sector.includes(sector)}
                      onChange={() => handleFilterChange("sector", sector)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all ${
                        activeFilters.sector.includes(sector)
                          ? "bg-yellow-500 border-yellow-500"
                          : "border-gray-600 group-hover:border-yellow-500"
                      }`}
                    >
                      {activeFilters.sector.includes(sector) && (
                        <svg className="w-2.5 h-2.5 text-black absolute top-0.5 left-0.5" fill="currentColor">
                          <path d="M8 .5l-4.5 4.5-2-2-1.5 1.5 3.5 3.5 6-6z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                    {sector}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case "contractValue":
        return (
          <div className="p-4 space-y-4" style={{ backgroundColor: "#1A1A1A" }}>
            <div className="space-y-3">
              <div className="text-sm text-white font-aptos text-center">
                {formatValue(positionToValue(contractValueMin))} - {formatValue(positionToValue(contractValueMax))}
              </div>

              <div className="relative px-2">
                {/* Track background */}
                <div className="h-2 rounded-full" style={{ backgroundColor: "#333" }}>
                  {/* Active range highlight */}
                  <div
                    className="h-2 rounded-full absolute top-0"
                    style={{
                      backgroundColor: "#D2AC38",
                      left: `${contractValueMin}%`,
                      width: `${contractValueMax - contractValueMin}%`,
                    }}
                  />
                </div>

                {/* Min range input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contractValueMin}
                  onChange={(e) => {
                    const newMin = Number(e.target.value)
                    if (newMin <= contractValueMax) {
                      setContractValueMin(newMin)
                    }
                  }}
                  className="absolute top-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto"
                  style={{ zIndex: 2 }}
                />

                {/* Max range input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contractValueMax}
                  onChange={(e) => {
                    const newMax = Number(e.target.value)
                    if (newMax >= contractValueMin) {
                      setContractValueMax(newMax)
                    }
                  }}
                  className="absolute top-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto"
                  style={{ zIndex: 1 }}
                />

                {/* Min handle - visible and interactive */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-yellow-500 bg-black -top-1 cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `calc(${contractValueMin}% - 8px)`,
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />

                {/* Max handle - visible and interactive */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-yellow-500 bg-black -top-1 cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `calc(${contractValueMax}% - 8px)`,
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 font-aptos px-2">
                <span>$0</span>
                <span>$10M</span>
                <span>$100M</span>
                <span>$1B</span>
                <span>$10B</span>
                <span>$100B+</span>
              </div>
            </div>
          </div>
        )

      case "lifecycle":
        return (
          <div className="p-4 space-y-2" style={{ backgroundColor: "#1A1A1A" }}>
            {["New", "Emerging", "Established", "Legacy"].map((stage) => (
              <label key={stage} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={activeFilters.lifecycleStage.includes(stage)}
                    onChange={() => handleFilterChange("lifecycleStage", stage)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      activeFilters.lifecycleStage.includes(stage)
                        ? stage === "New"
                          ? "bg-red-500 border-red-500"
                          : stage === "Emerging"
                            ? "bg-yellow-500 border-yellow-500"
                            : stage === "Established"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-green-500 border-green-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.lifecycleStage.includes(stage) && (
                      <svg className="w-2.5 h-2.5 text-black absolute top-0.5 left-0.5" fill="currentColor">
                        <path d="M8 .5l-4.5 4.5-2-2-1.5 1.5 3.5 3.5 6-6z" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  {stage}
                </span>
              </label>
            ))}
          </div>
        )

      case "momentum":
        return (
          <div className="p-4 space-y-2" style={{ backgroundColor: "#1A1A1A" }}>
            {["Dormant", "Stable", "Robust", "Explosive"].map((momentum) => (
              <label key={momentum} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={activeFilters.businessMomentum.includes(momentum)}
                    onChange={() => handleFilterChange("businessMomentum", momentum)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      activeFilters.businessMomentum.includes(momentum)
                        ? momentum === "Dormant"
                          ? "bg-red-500 border-red-500"
                          : momentum === "Stable"
                            ? "bg-yellow-500 border-yellow-500"
                            : momentum === "Robust"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-green-500 border-green-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.businessMomentum.includes(momentum) && (
                      <svg className="w-2.5 h-2.5 text-black absolute top-0.5 left-0.5" fill="currentColor">
                        <path d="M8 .5l-4.5 4.5-2-2-1.5 1.5 3.5 3.5 6-6z" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  {momentum}
                </span>
              </label>
            ))}
          </div>
        )

      case "ownership":
        return (
          <div className="p-4 space-y-2" style={{ backgroundColor: "#1A1A1A" }}>
            {["Independent", "Subsidiary", "Joint Venture"].map((ownership) => (
              <label key={ownership} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={activeFilters.ownership.includes(ownership)}
                    onChange={() => handleFilterChange("ownership", ownership)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      activeFilters.ownership.includes(ownership)
                        ? "bg-yellow-500 border-yellow-500"
                        : "border-gray-600 group-hover:border-yellow-500"
                    }`}
                  >
                    {activeFilters.ownership.includes(ownership) && (
                      <svg className="w-2.5 h-2.5 text-black absolute top-0.5 left-0.5" fill="currentColor">
                        <path d="M8 .5l-4.5 4.5-2-2-1.5 1.5 3.5 3.5 6-6z" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-aptos">
                  {ownership}
                </span>
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {filterConfigs.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap font-aptos ${
              openFilter === filter.id
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                : filter.hasActive
                  ? "border-yellow-500/50 bg-yellow-500/5 text-yellow-300"
                  : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            <span style={{ color: filter.hasActive ? "#D2AC38" : "inherit" }}>{filter.icon}</span>
            <span className="text-sm">{filter.label}</span>
            {filter.hasActive && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: "#D2AC38", color: "#000" }}
              >
                {filter.activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter Content */}
      {openFilter && (
        <div className="rounded-lg border border-gray-600 overflow-hidden">{renderFilterContent(openFilter)}</div>
      )}
    </div>
  )
}

// Active Opportunities Component
const ActiveOpportunities = ({ contractor }) => {
  const [viewFilter, setViewFilter] = useState("All")
  const [sortColumn, setSortColumn] = useState("goldengate_valuation")
  const [sortDirection, setSortDirection] = useState("DESC")
  const [showOpportunityModal, setShowOpportunityModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)

  // Sample opportunities data
  const sampleOpportunities = [
    {
      piid: "W15P7T-25-D-0001",
      type: "IDV",
      agency: "Army",
      description: "Enterprise Infrastructure Solutions (EIS)",
      expiry_days: 45,
      expiry_date: "2025-03-15",
      goldengate_valuation: 1600000000,
      base_value: 1800000000,
      competition_status: "competitive",
      win_rate: 35,
      competition_type: "Full & Open Competition",
      risk: "Medium",
      is_awarded: false,
      is_exclusive: false,
      is_multiple_award: true,
    },
    {
      piid: "FA8750-24-C-0089",
      type: "Contract",
      agency: "Air Force",
      description: "Advanced Battle Management System (ABMS)",
      expiry_days: 120,
      expiry_date: "2025-05-30",
      goldengate_valuation: 720000000,
      base_value: 750000000,
      competition_status: "awarded",
      win_rate: null,
      competition_type: "Small Business Set-Aside",
      risk: "Low",
      is_awarded: true,
      is_exclusive: false,
      is_multiple_award: false,
    },
    {
      piid: "N00024-25-D-0012",
      type: "IDV",
      agency: "Navy",
      description: "SeaPort-NxG Professional Services",
      expiry_days: 280,
      expiry_date: "2025-11-15",
      goldengate_valuation: 1100000000,
      base_value: 1200000000,
      competition_status: "exclusive",
      win_rate: null,
      competition_type: "Sole Source",
      risk: "Low",
      is_awarded: false,
      is_exclusive: true,
      is_multiple_award: false,
    },
    {
      piid: "GS-35F-0119Y",
      type: "IDV",
      agency: "GSA",
      description: "GSA Multiple Award Schedule (MAS)",
      expiry_days: 65,
      expiry_date: "2025-04-05",
      goldengate_valuation: 350000000,
      base_value: 380000000,
      competition_status: "competitive",
      win_rate: 28,
      competition_type: "Full & Open Competition",
      risk: "High",
      is_awarded: false,
      is_exclusive: false,
      is_multiple_award: true,
    },
    {
      piid: "HC1028-24-D-0003",
      type: "IDV",
      agency: "HHS",
      description: "Healthcare IT Modernization Services",
      expiry_days: 15,
      expiry_date: "2025-02-15",
      goldengate_valuation: 480000000,
      base_value: 520000000,
      competition_status: "competitive",
      win_rate: 42,
      competition_type: "Small Business Set-Aside",
      risk: "Medium",
      is_awarded: false,
      is_exclusive: false,
      is_multiple_award: true,
    },
  ]

  // Filter opportunities based on view
  const filteredOpportunities = sampleOpportunities.filter((opp) => {
    if (viewFilter === "AWDs") return opp.type === "Contract"
    if (viewFilter === "IDVs") return opp.type === "IDV"
    return true
  })

  // Sort opportunities
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    let aVal, bVal

    switch (sortColumn) {
      case "piid":
        aVal = a.piid
        bVal = b.piid
        break
      case "type":
        aVal = a.type
        bVal = b.type
        break
      case "agency":
        aVal = a.agency
        bVal = b.agency
        break
      case "description":
        aVal = a.description
        bVal = b.description
        break
      case "expiry_days":
        aVal = a.expiry_days
        bVal = b.expiry_days
        break
      case "goldengate_valuation":
        aVal = a.goldengate_valuation
        bVal = b.goldengate_valuation
        break
      case "base_value":
        aVal = a.base_value
        bVal = b.base_value
        break
      case "competition_status":
        // Custom sorting for competition status
        const statusOrder = { awarded: 0, exclusive: 1, competitive: 2 }
        aVal = statusOrder[a.competition_status] || 3
        bVal = statusOrder[b.competition_status] || 3
        if (aVal === bVal && a.competition_status === "competitive") {
          aVal = a.win_rate || 0
          bVal = b.win_rate || 0
        }
        break
      case "risk":
        const riskOrder = { Low: 0, Medium: 1, High: 2 }
        aVal = riskOrder[a.risk] || 3
        bVal = riskOrder[b.risk] || 3
        break
      default:
        aVal = a[sortColumn]
        bVal = b[sortColumn]
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return sortDirection === "ASC" ? aVal - bVal : bVal - aVal
  })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")
    } else {
      setSortColumn(column)
      setSortDirection("DESC")
    }
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`
    } else {
      return `$${amount.toLocaleString()}`
    }
  }

  const getExpiryColor = (days) => {
    if (days < 90) return "text-red-400"
    if (days < 180) return "text-yellow-400"
    return "text-white"
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "High":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  // Calculate summary metrics
  const totalValuation = filteredOpportunities.reduce((sum, opp) => sum + opp.goldengate_valuation, 0)
  const totalBaseValue = filteredOpportunities.reduce((sum, opp) => sum + opp.base_value, 0)
  const urgentCount = filteredOpportunities.filter((opp) => opp.expiry_days < 90).length
  const urgentPercentage = filteredOpportunities.length > 0 ? Math.round((urgentCount / filteredOpportunities.length) * 100) : 0
  const competitiveOpps = filteredOpportunities.filter(
    (opp) => opp.is_multiple_award && opp.competition_status === "competitive",
  )
  const avgWinRate =
    competitiveOpps.length > 0
      ? Math.round(competitiveOpps.reduce((sum, opp) => sum + (opp.win_rate || 0), 0) / competitiveOpps.length)
      : 0

  const mostCommonAgency = filteredOpportunities.reduce((acc, opp) => {
    acc[opp.agency] = (acc[opp.agency] || 0) + 1
    return acc
  }, {})
  const topAgency = Object.keys(mostCommonAgency).reduce(
    (a, b) => (mostCommonAgency[a] > mostCommonAgency[b] ? a : b),
    "N/A",
  )

  // Calculate opportunity type counts
  const awdCount = filteredOpportunities.filter((opp) => opp.type === "Contract").length
  const idvCount = filteredOpportunities.filter((opp) => opp.type === "IDV").length

  const openOpportunityModal = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setShowOpportunityModal(true)
  }

  const handleCompetitorClick = (competitorName) => {
    // This would navigate to the competitor's corporate profile
    console.log(`Navigating to ${competitorName}'s profile`)
    // In a real implementation, this would trigger navigation or open a new modal
  }

  // Generate AI summary for opportunities
  const generateAISummary = (opportunities) => {
    if (opportunities.length === 0) return "No opportunities available"
    
    // Extract keywords from descriptions
    const descriptions = opportunities.map(opp => opp.description || "");
    const allWords = descriptions.join(" ").toLowerCase().match(/\b\w+\b/g) || [];
    const stopWords = new Set([
      "the", "and", "of", "to", "for", "in", "on", "with", "by", "as", "at", "from", "is", "are", "a", "an", "this", "that", "these", "those", "or", "be", "it", "their", "its", "was", "were", "has", "have", "had", "but", "not", "which", "will", "can", "may", "also", "such"
    ]);
    const wordCounts = {};
    allWords.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
    const topKeywords = sortedWords.slice(0, 3).map(([word]) => word);
    
    // Compose a summary
    const productLine = topKeywords.length
      ? `Primary focus: ${topKeywords.join(", ")}.`
      : "Product/service details not available.";
    
    return `${productLine} ${opportunities.length} active contracts.`;
  }

  // Format PIID to show only first 3 characters followed by "..."
  const formatPIID = (piid) => {
    return piid.length > 3 ? `${piid.substring(0, 3)}...` : piid
  }

  // Format agency name to fit within character limit
  const formatAgency = (agency) => {
    const maxLength = 12 // Character limit for agency names
    return agency.length > maxLength ? `${agency.substring(0, maxLength)}...` : agency
  }

  const formatCompetitionType = (competitionType) => {
    switch (competitionType) {
      case "Full & Open Competition":
        return "Full & Open"
      case "Small Business Set-Aside":
        return "Set Aside"
      case "Sole Source":
        return "Sole Source"
      default:
        return competitionType
    }
  }

  const columnStyles = {
    type: { width: "8%", paddingRight: "5rem", paddingLeft: "1rem" },
    agency: { width: "12%", paddingRight: "0rem", paddingLeft: "1rem" },
    description: { width: "35%", paddingRight: "1rem", paddingLeft: "1rem" },
    expiry: { width: "10%", paddingRight: "1rem" },
    goldengate_valuation: { width: "10%", paddingRight: "2rem" },
    base_value: { width: "13%", paddingRight: "3rem" },
    competition_status: { width: "12%", paddingRight: "1rem" },
    risk: { width: "7%", paddingRight: "1rem" },
  }

  return (
    <>
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: "#0F0F0F",
          borderColor: "#333",
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1 font-aptos">Active Opportunities</h3>
            <p className="text-sm text-gray-400 font-aptos">
              Remaining balances of active definitive awards (AWDs) and indefinite vehicles (IDVs).
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1">
              {["All", "AWDs", "IDVs"].map((view) => (
                <button
                  key={view}
                  onClick={() => setViewFilter(view)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors font-aptos ${
                    viewFilter === view ? "bg-yellow-600 text-black" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              className="font-aptos bg-transparent"
              style={{ borderColor: "#666", color: "#999" }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="flex w-full mb-6 p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
          <div style={{ width: columnStyles.type.width }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Totals</p>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white font-aptos">{filteredOpportunities.length} Total</p>
              <p className="text-sm font-medium text-gray-300 font-aptos">{awdCount} AWDs</p>
              <p className="text-sm font-medium text-gray-300 font-aptos">{idvCount} IDVs</p>
          </div>
          </div>
          <div style={{ width: columnStyles.agency.width, paddingLeft: "calc(1rem - 45px)" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Top Agency</p>
            <p className="text-lg font-semibold text-white font-aptos">{topAgency}</p>
          </div>
          <div style={{ ...columnStyles.description, paddingLeft: "1rem", marginLeft: "-32px" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Summary</p>
            <p className="text-sm font-medium text-gray-300 font-aptos leading-tight">
              {generateAISummary(filteredOpportunities)}
            </p>
          </div>
          <div style={{ ...columnStyles.expiry, paddingLeft: "calc(1rem + 7px)" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Urgent %</p>
            <p className="text-lg font-semibold text-red-400 font-aptos">{urgentPercentage}%</p>
          </div>
          <div style={{ ...columnStyles.goldengate_valuation, paddingLeft: "calc(1rem + 5px)" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Est Val</p>
            <p className="text-lg font-semibold" style={{ color: "#D2AC38" }}>
              {formatCurrency(totalValuation)}
            </p>
          </div>
          <div style={{ ...columnStyles.base_value, paddingLeft: "calc(1rem + 3px)" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Base Val</p>
            <p className="text-lg font-semibold text-white">{formatCurrency(totalBaseValue)}</p>
          </div>
          <div style={{ ...columnStyles.competition_status, paddingLeft: "calc(1rem + 2px)" }}>
            <p className="text-xs text-gray-500 mb-1 font-aptos">Avg Win Rate</p>
            <p className="text-lg font-semibold text-white">{avgWinRate}%</p>
          </div>
          <div style={columnStyles.risk}>{/* Spacer */}</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="border-b" style={{ borderColor: "#333", height: "80px" }}>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{ 
                    width: columnStyles.type.width, 
                    paddingRight: columnStyles.type.paddingRight,
                    paddingLeft: columnStyles.type.paddingLeft,
                    color: sortColumn === "type" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("type")}
                >
                  Type
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{ 
                    width: columnStyles.agency.width, 
                    paddingRight: columnStyles.agency.paddingRight,
                    paddingLeft: columnStyles.agency.paddingLeft,
                    color: sortColumn === "agency" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("agency")}
                >
                  Agency
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{
                    width: columnStyles.description.width,
                    paddingRight: columnStyles.description.paddingRight,
                    color: sortColumn === "description" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("description")}
                >
                  Description
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{ 
                    width: columnStyles.expiry.width, 
                    paddingRight: columnStyles.expiry.paddingRight,
                    color: sortColumn === "expiry_days" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("expiry_days")}
                >
                  Expiry
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{
                    width: columnStyles.goldengate_valuation.width,
                    paddingRight: columnStyles.goldengate_valuation.paddingRight,
                    color: sortColumn === "goldengate_valuation" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("goldengate_valuation")}
                >
                  Est Val
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{ 
                    width: columnStyles.base_value.width, 
                    paddingRight: columnStyles.base_value.paddingRight,
                    color: sortColumn === "base_value" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("base_value")}
                >
                  Base Val
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{
                    width: columnStyles.competition_status.width,
                    paddingRight: columnStyles.competition_status.paddingRight,
                    color: sortColumn === "competition_status" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("competition_status")}
                >
                  Competition
                  <span className="ml-1 cursor-help" title="Win rate for competitive opportunities">
                    ⓘ
                  </span>
                </th>
                <th
                  className="text-left py-3 text-sm font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                  style={{ 
                    width: columnStyles.risk.width, 
                    paddingRight: columnStyles.risk.paddingRight,
                    color: sortColumn === "risk" ? "#D2AC38" : "#9CA3AF"
                  }}
                  onClick={() => handleSort("risk")}
                >
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOpportunities.map((opportunity, index) => (
                <tr
                  key={opportunity.piid}
                  onClick={() => openOpportunityModal(opportunity)}
                  className="border-b hover:bg-gray-800/50 cursor-pointer transition-colors"
                  style={{
                    borderColor: "#333",
                    backgroundColor: index % 2 === 0 ? "#0F0F0F" : "#1A1A1A",
                    height: "80px", // Increased height to accommodate two lines
                    maxHeight: "80px", // Ensure no overflow
                    minHeight: "80px", // Ensure minimum height
                  }}
                >

                  <td className="align-middle" style={{ width: columnStyles.type.width, paddingRight: columnStyles.type.paddingRight, paddingLeft: columnStyles.type.paddingLeft, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-aptos ${
                        opportunity.type === "Contract"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {opportunity.type === "Contract" ? "AWD" : opportunity.type}
                    </span>
                  </td>
                  <td
                    className="text-sm text-white font-aptos align-middle"
                    style={{ width: columnStyles.agency.width, paddingRight: columnStyles.agency.paddingRight, paddingLeft: columnStyles.agency.paddingLeft, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}
                  >
                    <div className="truncate" title={opportunity.agency}>
                      {formatAgency(opportunity.agency)}
                    </div>
                  </td>
                  <td
                    className="text-sm text-gray-300 font-aptos align-middle"
                    style={{ width: columnStyles.description.width, paddingRight: columnStyles.description.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}
                  >
                    <div className="truncate" title={opportunity.description}>
                      {opportunity.description}
                    </div>
                  </td>
                  <td className="text-sm font-aptos align-middle" style={{ width: columnStyles.expiry.width, paddingRight: columnStyles.expiry.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}>
                    <div className={`${getExpiryColor(opportunity.expiry_days)}`} style={{ lineHeight: "1.2" }}>
                      {opportunity.expiry_days} days
                    </div>
                    <div className="text-xs text-gray-500" style={{ lineHeight: "1.2" }}>
                      {new Date(opportunity.expiry_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td
                    className="text-sm font-semibold font-aptos align-middle"
                    style={{ width: columnStyles.goldengate_valuation.width, color: "#D2AC38", paddingRight: columnStyles.goldengate_valuation.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}
                  >
                    <div className="truncate" title={formatCurrency(opportunity.goldengate_valuation)}>
                    {formatCurrency(opportunity.goldengate_valuation)}
                    </div>
                  </td>
                  <td
                    className="text-sm text-gray-300 font-aptos align-middle"
                    style={{ width: columnStyles.base_value.width, paddingRight: columnStyles.base_value.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}
                  >
                    <div className="truncate" title={formatCurrency(opportunity.base_value)}>
                    {formatCurrency(opportunity.base_value)}
                    </div>
                  </td>
                  <td
                    className="text-sm font-aptos align-middle"
                    style={{ width: columnStyles.competition_status.width, paddingRight: columnStyles.competition_status.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}
                  >
                    <div style={{ lineHeight: "1.2" }}>
                      {opportunity.is_awarded ? (
                        <span className="font-medium text-green-400">Awarded</span>
                      ) : opportunity.is_exclusive ? (
                        <span className="font-medium" style={{ color: "#D2AC38" }}>
                          Exclusive
                        </span>
                      ) : (
                        <span className="font-medium" style={{ color: "#D2AC38" }}>
                          {opportunity.win_rate}% Win Rate
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500" style={{ lineHeight: "1.2" }}>
                      {formatCompetitionType(opportunity.competition_type)}
                    </div>
                  </td>
                  <td className="text-sm font-aptos align-middle" style={{ width: columnStyles.risk.width, paddingRight: columnStyles.risk.paddingRight, verticalAlign: "middle", height: "80px", paddingTop: "16px", paddingBottom: "16px", overflow: "hidden" }}>
                    <div>
                    <span className={getRiskColor(opportunity.risk)}>{opportunity.risk}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {showOpportunityModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white font-aptos">PIID: {selectedOpportunity.piid}</h3>
                  <p className="text-gray-400 mt-1 font-aptos">
                    {selectedOpportunity.agency} • {selectedOpportunity.type}
                  </p>
                </div>
                <button
                  onClick={() => setShowOpportunityModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2 font-aptos">Description</h4>
                <p className="text-gray-300 leading-relaxed font-aptos">{selectedOpportunity.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                  <p className="text-sm text-gray-500 mb-1 font-aptos">Goldengate Valuation</p>
                  <p className="text-lg font-semibold font-aptos" style={{ color: "#D2AC38" }}>
                    {formatCurrency(selectedOpportunity.goldengate_valuation)}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                  <p className="text-sm text-gray-500 mb-1 font-aptos">Base Value</p>
                  <p className="text-lg font-semibold text-white font-aptos">
                    {formatCurrency(selectedOpportunity.base_value)}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                  <p className="text-sm text-gray-500 mb-1 font-aptos">Days to Expiry</p>
                  <p className={`text-lg font-semibold font-aptos ${getExpiryColor(selectedOpportunity.expiry_days)}`}>
                    {selectedOpportunity.expiry_days}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                  <p className="text-sm text-gray-500 mb-1 font-aptos">Risk Level</p>
                  <p className={`text-lg font-semibold font-aptos ${getRiskColor(selectedOpportunity.risk)}`}>
                    {selectedOpportunity.risk}
                  </p>
                </div>
              </div>

              {/* Competition Details */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 font-aptos">Competition Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                    <p className="text-sm text-gray-500 mb-2 font-aptos">Competition Type</p>
                    <p className="text-white font-aptos">{formatCompetitionType(selectedOpportunity.competition_type)}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                    <p className="text-sm text-gray-500 mb-2 font-aptos">Status</p>
                    <div className="flex items-center gap-2">
                      {selectedOpportunity.is_awarded ? (
                        <>
                          <span className="text-green-400 font-medium font-aptos">Awarded</span>
                          <span className="text-green-500">✓</span>
                        </>
                      ) : selectedOpportunity.is_exclusive ? (
                        <span className="font-medium font-aptos" style={{ color: "#D2AC38" }}>
                          Exclusive
                        </span>
                      ) : (
                        <span className="font-medium font-aptos" style={{ color: "#D2AC38" }}>
                          {selectedOpportunity.win_rate}% Win Rate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitors Section */}
                {selectedOpportunity.type === "IDV" && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 font-aptos">Competitors</h4>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                    <div className="space-y-2">
                      {["Booz Allen Hamilton", "CACI International", "SAIC", "Leidos", "General Dynamics"].map((competitor) => (
                        <button
                          key={competitor}
                          onClick={() => handleCompetitorClick(competitor)}
                          className="block w-full text-left p-2 rounded hover:bg-gray-800 transition-colors text-white font-aptos"
                        >
                          {competitor}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-800">
                {/* Action buttons removed for now */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Forensic Due Diligence Dashboard Component
const ForensicDueDiligenceDashboard = ({ contractor }) => {
  const [selectedPeerUei, setSelectedPeerUei] = useState("peer-median")
  const [sortColumn, setSortColumn] = useState("composite_score")
  const [sortDirection, setSortDirection] = useState("DESC")
  const [queryText, setQueryText] = useState("")
  const [peerComparisonView, setPeerComparisonView] = useState("Current")

  // Sample forensic data
  const forensicData = {
    overallScore: 78,
    riskRating: "MODERATE",
    peerPercentile: 65,
    keyRiskFactors: [
      "3 NAICS code changes in past 24 months",
      "Above-average contract modification rate (18%)",
      "Concentration risk: 67% revenue from single agency",
    ],
  }

  const peerComparisonData = [
    {
      name: contractor.name,
      composite_score: 78,
      identity_coherence: 85,
      relationship_stability: 72,
      modification_discipline: 65,
      performance_risk: 82,
      subcontractor_network: 76,
      total_obligations: "$4.2B",
      risk_rating: "MODERATE",
      isCurrent: true,
    },
    {
      name: "Peer Median",
      composite_score: 72,
      identity_coherence: 75,
      relationship_stability: 70,
      modification_discipline: 68,
      performance_risk: 74,
      subcontractor_network: 72,
      total_obligations: "$2.8B",
      risk_rating: "MODERATE",
      isCurrent: false,
      isMedian: true,
    },
    {
      name: "Booz Allen Hamilton",
      composite_score: 89,
      identity_coherence: 92,
      relationship_stability: 88,
      modification_discipline: 85,
      performance_risk: 91,
      subcontractor_network: 89,
      total_obligations: "$12.8B",
      risk_rating: "LOW",
      isCurrent: false,
    },
    {
      name: "CACI International",
      composite_score: 82,
      identity_coherence: 88,
      relationship_stability: 79,
      modification_discipline: 76,
      performance_risk: 85,
      subcontractor_network: 82,
      total_obligations: "$8.9B",
      risk_rating: "LOW",
      isCurrent: false,
    },
    {
      name: "SAIC",
      composite_score: 75,
      identity_coherence: 80,
      relationship_stability: 73,
      modification_discipline: 70,
      performance_risk: 78,
      subcontractor_network: 74,
      total_obligations: "$7.1B",
      risk_rating: "MODERATE",
      isCurrent: false,
    },
    {
      name: "General Dynamics",
      composite_score: 91,
      identity_coherence: 95,
      relationship_stability: 89,
      modification_discipline: 88,
      performance_risk: 93,
      subcontractor_network: 90,
      total_obligations: "$67.2B",
      risk_rating: "LOW",
      isCurrent: false,
    },
  ]

  const radarData = {
    target: {
      identity_coherence: 85,
      relationship_stability: 72,
      modification_discipline: 65,
      performance_risk: 82,
      subcontractor_network: 76,
    },
    comparison:
      selectedPeerUei === "peer-median"
        ? {
            identity_coherence: 75,
            relationship_stability: 70,
            modification_discipline: 68,
            performance_risk: 74,
            subcontractor_network: 72,
          }
        : peerComparisonData.find((p) => p.name === selectedPeerUei)
          ? {
              identity_coherence: peerComparisonData.find((p) => p.name === selectedPeerUei).identity_coherence,
              relationship_stability: peerComparisonData.find((p) => p.name === selectedPeerUei).relationship_stability,
              modification_discipline: peerComparisonData.find((p) => p.name === selectedPeerUei)
                .modification_discipline,
              performance_risk: peerComparisonData.find((p) => p.name === selectedPeerUei).performance_risk,
              subcontractor_network: peerComparisonData.find((p) => p.name === selectedPeerUei).subcontractor_network,
            }
          : {
              identity_coherence: 75,
              relationship_stability: 70,
              modification_discipline: 68,
              performance_risk: 74,
              subcontractor_network: 72,
            },
  }

  const getRiskColor = (rating) => {
    switch (rating) {
      case "LOW":
        return "text-green-400"
      case "MODERATE":
        return "text-yellow-400"
      case "HIGH":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getRiskBgColor = (rating) => {
    switch (rating) {
      case "LOW":
        return "bg-green-500/20"
      case "MODERATE":
        return "bg-yellow-500/20"
      case "HIGH":
        return "bg-red-500/20"
      default:
        return "bg-gray-500/20"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-[#D2AC38]"
    return "text-red-400"
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")
    } else {
      setSortColumn(column)
      setSortDirection("DESC")
    }
  }

  const sortedPeerData = [...peerComparisonData].sort((a, b) => {
    let aVal = a[sortColumn]
    let bVal = b[sortColumn]

    if (typeof aVal === "string" && aVal.includes("$")) {
      aVal = Number.parseFloat(aVal.replace(/[$B]/g, ""))
      bVal = Number.parseFloat(bVal.replace(/[$B]/g, ""))
    }

    return sortDirection === "ASC" ? aVal - bVal : bVal - aVal
  })

  const getDeltaColor = (value) => {
    if (peerComparisonView === "Delta") {
      // Check if the value contains a percentage or dollar sign
      if (typeof value === "string") {
        if (value.includes("+")) return "text-green-400"
        if (value.includes("-")) return "text-red-400"
        // For values without explicit +/-, try to parse
        const numValue = parseFloat(value.replace(/[$,%]/g, ""))
        if (!isNaN(numValue)) {
          return numValue > 0 ? "text-green-400" : numValue < 0 ? "text-red-400" : "text-gray-300"
        }
      }
    }
    return "text-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1 font-aptos">Operational Integrity Analysis</h3>
      </div>

      {/* Executive Summary */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: "#0F0F0F",
          borderColor: "#333",
        }}
      >
        <h3 className="text-xl font-semibold mb-4 font-aptos">Executive Summary</h3>
        <p className="text-gray-300 leading-relaxed font-aptos">
          {contractor.name} demonstrates moderate operational integrity with a composite score of 78, placing it in the
          65th percentile among sector peers. The analysis reveals strong identity coherence (85) and performance risk
          management (82), indicating stable corporate governance and reliable contract execution. However, areas of
          concern include modification discipline (65) with an 18% contract modification rate above industry average,
          and moderate relationship stability (72) driven by 67% revenue concentration in a single agency. The company's
          subcontractor network score (76) suggests adequate supply chain diversification, though recent NAICS code
          changes (3 in 24 months) warrant monitoring for strategic consistency.
        </p>
      </div>

      {/* Overall Score and Component Indicators */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: "#0F0F0F",
          borderColor: "#333",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Main Score Section */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-3 font-aptos">Overall Operational Integrity</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-4xl font-bold font-aptos ${getScoreColor(forensicData.overallScore)}`}>
                {forensicData.overallScore}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium font-aptos ${getRiskColor(forensicData.riskRating)} ${getRiskBgColor(forensicData.riskRating)}`}
                >
                  {forensicData.riskRating} RISK
                </span>
                <p className="text-xs text-gray-400 mt-1 font-aptos">
                  {forensicData.peerPercentile}th percentile vs peers
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3 font-aptos">Key Risk Factors</h4>
              <ul className="space-y-2">
                {forensicData.keyRiskFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2 font-aptos">
                    <span className="text-[#D2AC38] mt-1">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Component Indicators Row */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-medium text-gray-400 mb-4 font-aptos">Component Scores</h4>
            <div className="grid grid-cols-5 gap-4">
              {[
                {
                  title: "Identity Coherence",
                  score: radarData.target.identity_coherence,
                  description: "Corporate stability & consistency",
                },
                {
                  title: "Relationship Stability",
                  score: radarData.target.relationship_stability,
                  description: "Agency partnerships & retention",
                },
                {
                  title: "Modification Discipline",
                  score: radarData.target.modification_discipline,
                  description: "Contract change management",
                },
                {
                  title: "Performance Risk",
                  score: radarData.target.performance_risk,
                  description: "Execution & delivery quality",
                },
                {
                  title: "Subcontractor Network",
                  score: radarData.target.subcontractor_network,
                  description: "Supply chain diversification",
                },
              ].map((component) => (
                <div
                  key={component.title}
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: "#1A1A1A" }}
                >
                  <div className={`text-2xl font-bold mb-1 font-aptos ${getScoreColor(component.score)}`}>
                    {component.score}
                  </div>
                  <h5 className="text-xs font-medium text-white mb-1 font-aptos">{component.title}</h5>
                  <p className="text-xs text-gray-400 leading-tight font-aptos">{component.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Peer Comparison Table and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peer Comparison Table */}
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: "#0F0F0F",
            borderColor: "#333",
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: "#333" }}>
            <h4 className="text-lg font-semibold text-white font-aptos">Peer Comparison</h4>
          </div>
          <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#D2AC38 #333" }}>
            <table className="w-full border-collapse">
              <thead className="sticky top-0" style={{ backgroundColor: "#0F0F0F" }}>
                <tr className="border-b" style={{ borderColor: "#333" }}>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "name" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("name")}
                  >
                    Contractor
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "composite_score" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("composite_score")}
                  >
                    Score
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "identity_coherence" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("identity_coherence")}
                  >
                    ID
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "relationship_stability" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("relationship_stability")}
                  >
                    RS
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "modification_discipline" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("modification_discipline")}
                  >
                    MD
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "performance_risk" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("performance_risk")}
                  >
                    PR
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "subcontractor_network" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("subcontractor_network")}
                  >
                    SN
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "total_obligations" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("total_obligations")}
                  >
                    Total
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white transition-colors font-aptos"
                    style={{ color: sortColumn === "risk_rating" ? "#D2AC38" : "#9CA3AF" }}
                    onClick={() => handleSort("risk_rating")}
                  >
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPeerData.map((peer, index) => (
                  <tr
                    key={`${peer.name}-${index}`}
                    className="border-b"
                    style={{
                      borderColor: "#333",
                      backgroundColor: peer.isCurrent
                        ? "rgba(210, 172, 56, 0.15)"
                        : peer.isMedian
                          ? "rgba(153, 153, 153, 0.1)"
                          : "transparent",
                    }}
                  >
                    <td className="py-2 px-3 text-xs font-aptos">
                      <span
                        className={
                          peer.isCurrent
                            ? "font-medium text-yellow-400"
                            : peer.isMedian
                              ? "italic text-gray-400"
                              : "text-white"
                        }
                      >
                        {peer.name}
                      </span>
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.composite_score)}`}> 
                      {peer.composite_score}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.identity_coherence)}`}> 
                      {peer.identity_coherence}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.relationship_stability)}`}> 
                      {peer.relationship_stability}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.modification_discipline)}`}> 
                      {peer.modification_discipline}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.performance_risk)}`}> 
                      {peer.performance_risk}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.subcontractor_network)}`}> 
                      {peer.subcontractor_network}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : "text-gray-300"}`}> 
                      {peer.total_obligations}
                    </td>
                    <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getRiskColor(peer.risk_rating)}`}> 
                      {peer.risk_rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar Chart */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: "#0F0F0F",
            borderColor: "#333",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold text-white font-aptos">Component Analysis</h4>
            <select
              value={selectedPeerUei}
              onChange={(e) => setSelectedPeerUei(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1 font-aptos"
            >
              <option value="peer-median">Peer Median</option>
              {peerComparisonData
                .filter((p) => !p.isCurrent && !p.isMedian)
                .map((peer) => (
                  <option key={peer.name} value={peer.name}>
                    {peer.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Grid circles */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#333" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#333" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="#333" strokeWidth="1" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="#333" strokeWidth="1" />

                {/* Grid lines */}
                <line x1="100" y1="20" x2="100" y2="180" stroke="#333" strokeWidth="1" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="#333" strokeWidth="1" />
                <line x1="44" y1="44" x2="156" y2="156" stroke="#333" strokeWidth="1" />
                <line x1="156" y1="44" x2="44" y2="156" stroke="#333" strokeWidth="1" />

                {/* Comparison polygon (gray) */}
                <polygon
                  points={`100,${100 - radarData.comparison.identity_coherence * 0.8} ${100 + radarData.comparison.relationship_stability * 0.8 * Math.cos(Math.PI / 10)},${100 - radarData.comparison.relationship_stability * 0.8 * Math.sin(Math.PI / 10)} ${100 + radarData.comparison.modification_discipline * 0.8 * Math.cos((3 * Math.PI) / 10)},${100 + radarData.comparison.modification_discipline * 0.8 * Math.sin((3 * Math.PI) / 10)} ${100 - radarData.comparison.performance_risk * 0.8 * Math.cos((3 * Math.PI) / 10)},${100 + radarData.comparison.performance_risk * 0.8 * Math.sin((3 * Math.PI) / 10)} ${100 - radarData.comparison.subcontractor_network * 0.8 * Math.cos(Math.PI / 10)},${100 - radarData.comparison.subcontractor_network * 0.8 * Math.sin(Math.PI / 10)}`}
                  fill="none"
                  stroke="#999"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />

                {/* Target polygon (blue) */}
                <polygon
                  points={`100,${100 - radarData.target.identity_coherence * 0.8} ${100 + radarData.target.relationship_stability * 0.8 * Math.cos(Math.PI / 10)},${100 - radarData.target.relationship_stability * 0.8 * Math.sin(Math.PI / 10)} ${100 + radarData.target.modification_discipline * 0.8 * Math.cos((3 * Math.PI) / 10)},${100 + radarData.target.modification_discipline * 0.8 * Math.sin((3 * Math.PI) / 10)} ${100 - radarData.target.performance_risk * 0.8 * Math.cos((3 * Math.PI) / 10)},${100 + radarData.target.performance_risk * 0.8 * Math.sin((3 * Math.PI) / 10)} ${100 - radarData.target.subcontractor_network * 0.8 * Math.cos(Math.PI / 10)},${100 - radarData.target.subcontractor_network * 0.8 * Math.sin(Math.PI / 10)}`}
                  fill="#3B82F6"
                  fillOpacity="0.3"
                  stroke="#D2AC38"
                  strokeWidth="2"
                />

                {/* Labels */}
                <text x="100" y="15" textAnchor="middle" className="text-xs fill-gray-300 font-aptos">
                  ID
                </text>
                <text x="170" y="70" textAnchor="middle" className="text-xs fill-gray-300 font-aptos">
                  RS
                </text>
                <text x="170" y="140" textAnchor="middle" className="text-xs fill-gray-300 font-aptos">
                  MD
                </text>
                <text x="30" y="140" textAnchor="middle" className="text-xs fill-gray-300 font-aptos">
                  PR
                </text>
                <text x="30" y="70" textAnchor="middle" className="text-xs fill-gray-300 font-aptos">
                  SN
                </text>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span className="text-xs text-white font-aptos">{contractor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-gray-400" style={{ borderTop: "2px dashed #999" }}></div>
              <span className="text-xs text-gray-300 font-aptos">
                {selectedPeerUei === "peer-median" ? "Peer Median" : selectedPeerUei}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Query Interface */}
      <div
        className="rounded-lg border p-4 mt-6"
        style={{
          backgroundColor: "#1A1A1A",
          borderColor: "#D2AC38",
          borderWidth: 3,
        }}
      >
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Ask about the assumptions, audit the presented numbers, or inquire about the methodology..."
          className="w-full bg-transparent text-white resize-none focus:outline-none font-aptos"
          style={{ 
            color: "white",
            opacity: 1
          }}
          rows={3}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Press ⌘+Enter to submit</span>
          <Button size="sm" style={{ backgroundColor: "#D2AC38", color: "#000" }} disabled={!queryText.trim()}>
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Analysis Data</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <button
              className="w-full py-3 rounded bg-[#D2AC38] text-black font-semibold hover:bg-yellow-500 transition-colors"
              onClick={() => { exportToXLSX(); setShowExportModal(false); }}
            >
              Export as XLSX
            </button>
            <button
              className="w-full py-3 rounded bg-[#D2AC38] text-black font-semibold hover:bg-yellow-500 transition-colors"
              onClick={() => { exportToCSV(); setShowExportModal(false); }}
            >
              Export as CSV
            </button>
            <button
              className="w-full py-3 rounded bg-[#D2AC38] text-black font-semibold hover:bg-yellow-500 transition-colors"
              onClick={() => { exportToPDF(); setShowExportModal(false); }}
            >
              Export as PDF
            </button>
            <button
              className="w-full py-3 rounded bg-[#D2AC38] text-black font-semibold hover:bg-yellow-500 transition-colors"
              onClick={() => { exportToPPTX(); setShowExportModal(false); }}
            >
              Export as PPTX
            </button>
          </div>
          <DialogClose asChild>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black">✕</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 1. Add SortablePortfolioItem component above QueryPage
function SortablePortfolioItem({ company, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: company.uei });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full p-0 rounded-lg border hover:border-yellow-600 transition-all group bg-transparent"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4 w-full">
          {/* Drag handle */}
          <span
            {...attributes}
            {...listeners}
            className="flex items-center justify-center cursor-grab select-none mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ minWidth: 24 }}
            tabIndex={-1}
            aria-label="Drag handle"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-[#D2AC38]" />
          </span>
          {/* Main clickable area */}
          <button
            onClick={onClick}
            className="flex items-start gap-4 flex-1 p-5 text-left rounded-lg bg-transparent"
            style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
            tabIndex={0}
          >
            <img
              src={company.image}
              alt={company.name + ' logo'}
              width={80}
              height={80}
              className="object-contain rounded"
              style={{ display: 'inline-block' }}
            />
            <div>
              <h3 className="font-semibold text-lg font-aptos" style={{ color: "#FFFFFF" }}>
                {company.name}
              </h3>
              <p className="text-sm text-gray-500 font-aptos">
                {company.sector} • {company.uei}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-400 font-aptos">
                  Revenue: <span className="text-white font-medium">{company.revenue}</span>
                </span>
                <span className="text-xs text-gray-400 font-aptos">
                  Contracts: <span className="text-white font-medium">{company.contracts}</span>
                </span>
                <span className="text-xs text-green-400 font-medium flex items-center gap-1 font-aptos">
                  <TrendingUp className="w-3 h-3" />
                  {company.growth}
                </span>
              </div>
            </div>
          </button>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#D2AC38] transition-colors" />
      </div>
    </div>
  );
}

export default function QueryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMode, setActiveMode] = useState("identify") // "identify", "portfolio", or "analysis"
  const [selectedFilters, setSelectedFilters] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [selectedContractor, setSelectedContractor] = useState(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [openFilter, setOpenFilter] = useState(null)
  const [contractValueMin, setContractValueMin] = useState(0)
  const [contractValueMax, setContractValueMax] = useState(100)
  const [activeFilters, setActiveFilters] = useState({
    location: [],
    states: [],
    sector: [],
    contractValueMin: 0,
    contractValueMax: 100,
    lifecycleStage: [],
    businessMomentum: [],
    ownership: [],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Analysis workflow state
  const [analysisContractor, setAnalysisContractor] = useState(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [activeDeployment, setActiveDeployment] = useState(null)
  const [deploymentResults, setDeploymentResults] = useState(null)
  
  // Portfolio state
  const [portfolioContractors, setPortfolioContractors] = useState([])
  const [portfolioCompanies, setPortfolioCompanies] = useState([
    {
      name: "Palantir Technologies",
      uei: "UEI123",
      image: "/images/2_informationtechnology.png",
      location: "CA, USA",
      sector: "Information Technology",
      primaryNAICS: "541511",
      lifecycleStage: "Established",
      totalAwards: "$4.2B",
      businessMomentum: "Robust",
      ownership: "Independent",
      description:
        "Founded in 2003, Palantir is a leading data analytics platform provider specializing in big data analytics for government and commercial clients.",
      contracts: 147,
      agencies: ["DoD", "CIA", "HHS"],
      revenue: "$2.3B",
      employees: "3,500+",
      clearance: "TS/SCI",
      naics: ["541511", "541512"],
      growth: "+24%",
      ageSinceFirstContract: 21,
    },
    {
      name: "Anduril Industries",
      uei: "UEI456",
      image: "/images/1_defense.png",
      location: "CA, USA",
      sector: "Aerospace & Defense",
      primaryNAICS: "336414",
      lifecycleStage: "Emerging",
      totalAwards: "$1.2B",
      businessMomentum: "Explosive",
      ownership: "Independent",
      description:
        "Founded in 2017, Anduril Industries develops autonomous systems and AI technology for national security applications.",
      contracts: 73,
      agencies: ["DoD", "DHS"],
      revenue: "$890M",
      employees: "1,800+",
      clearance: "TS/SCI",
      naics: ["336414", "541712"],
      growth: "+89%",
      ageSinceFirstContract: 7,
    },
    {
      name: "Booz Allen Hamilton",
      uei: "UEI789",
      image: "/images/4_professionalservices.png",
      location: "VA, USA",
      sector: "Professional Services",
      primaryNAICS: "541330",
      lifecycleStage: "Legacy",
      totalAwards: "$12.8B",
      businessMomentum: "Stable",
      ownership: "Independent",
      description:
        "Established in 1914, Booz Allen Hamilton is a premier management and technology consulting firm serving government and commercial clients.",
      contracts: 892,
      agencies: ["DoD", "NASA", "DHS", "VA"],
      revenue: "$8.4B",
      employees: "29,000+",
      clearance: "TS/SCI",
      naics: ["541511", "541330"],
      growth: "+12%",
      ageSinceFirstContract: 45,
    },
  ]);

  const deploymentOptions = [
    {
      id: "contract-analytics",
      title: "Contract Analytics",
      description: "Pipeline valuation, growth patterns, competitive positioning",
      icon: <BarChart3 className="w-6 h-6" />,
      query: (contractor) =>
        `Analyze contract performance and growth patterns for ${contractor.name} (${contractor.uei})`,
    },
    {
      id: "forensic-diligence",
      title: "Forensic Due Diligence",
      description: "Operational integrity analysis, relationship mapping, modification patterns, performance risk",
      icon: <Activity className="w-6 h-6" />,
      query: (contractor) => `Perform forensic due diligence on ${contractor.name}`,
    },
    {
      id: "agency-exposure",
      title: "Agency Exposure",
      description: "Agency concentration, budget availability, trend monitoring",
      icon: <Building2 className="w-6 h-6" />,
      query: (contractor) => `Analyze agency exposure and concentration for ${contractor.name}`,
      disabled: true,
    },
    {
      id: "market-perception",
      title: "Market Perception",
      description: "Aggregated news media, social sentiment, tonality shifts",
      icon: <Globe className="w-6 h-6" />,
      query: (contractor) => `Track market perception and sentiment for ${contractor.name}`,
      disabled: true,
    },
  ]

  // Convert linear slider position to exponential contract value
  const positionToValue = (position) => {
    if (position <= 30) {
      // 0-30% of slider = $0-$100M (linear)
      return (position / 30) * 0.1 // 0 to 0.1B
    } else if (position <= 60) {
      // 30-60% of slider = $100M-$1B (linear)
      return 0.1 + ((position - 30) / 30) * 0.9 // 0.1B to 1B
    } else if (position <= 85) {
      // 60-85% of slider = $1B-$10B (linear)
      return 1 + ((position - 60) / 25) * 9 // 1B to 10B
    } else {
      // 85-100% of slider = $10B-$100B+ (exponential)
      return 10 + ((position - 85) / 15) * 90 // 10B to 100B+
    }
  }

  // Function to get sector avatar image
  const getSectorAvatar = (sector) => {
    const sectorMap = {
      "Aerospace & Defense": "/images/1_defense.png",
      "Information Technology": "/images/2_informationtechnology.png",
      Construction: "/images/3_construction.png",
      "Professional Services": "/images/4_professionalservices.png",
      "Research & Development": "/images/5_researchanddevelopment.png",
      Manufacturing: "/images/6_manufacturing.png",
      "Facilities Management": "/images/7_facilitiesmanagement.png",
      Healthcare: "/images/8_healthcare.png",
      Transportation: "/images/9_transportation.png",
      Environmental: "/images/10_environmentalservices.png",
      Telecommunications: "/images/11_telecom.png",
      Energy: "/images/12_energy.png",
      "Financial Services": "/images/13_financialservices.png",
      Education: "/images/14_educationservices.png",
      Agriculture: "/images/15_agriculture.png",
      Other: "/images/16_other.png",
    }

    return sectorMap[sector] || "/images/16_other.png"
  }

  const filterDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilterDropdown])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      contractValueMin: contractValueMin,
      contractValueMax: contractValueMax,
    }))
  }, [contractValueMin, contractValueMax])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Apply filters to search results
      let filteredResults = [...sampleSearchResults]

      // Apply location filter
      if (activeFilters.location.length > 0) {
        filteredResults = filteredResults.filter((contractor) => {
          if (activeFilters.location.includes("US")) {
            return contractor.location.includes("USA")
          }
          if (activeFilters.location.includes("International")) {
            return !contractor.location.includes("USA")
          }
          return true
        })
      }

      // Apply states filter
      if (activeFilters.states.length > 0) {
        filteredResults = filteredResults.filter((contractor) => {
          const state = contractor.location.split(", ")[0]
          return activeFilters.states.includes(state)
        })
      }

      // Apply sector filter
      if (activeFilters.sector.length > 0) {
        filteredResults = filteredResults.filter((contractor) => activeFilters.sector.includes(contractor.sector))
      }

      // Apply lifecycle stage filter
      if (activeFilters.lifecycleStage.length > 0) {
        filteredResults = filteredResults.filter((contractor) =>
          activeFilters.lifecycleStage.includes(contractor.lifecycleStage),
        )
      }

      // Apply business momentum filter
      if (activeFilters.businessMomentum.length > 0) {
        filteredResults = filteredResults.filter((contractor) =>
          activeFilters.businessMomentum.includes(contractor.businessMomentum),
        )
      }

      // Apply ownership filter
      if (activeFilters.ownership.length > 0) {
        filteredResults = filteredResults.filter((contractor) => activeFilters.ownership.includes(contractor.ownership))
      }

      // Apply contract value range filter
      const minContractValue = positionToValue(contractValueMin)
      const maxContractValue = positionToValue(contractValueMax)

      filteredResults = filteredResults.filter((contractor) => {
        const totalAwardsStr = contractor.totalAwards.replace(/[$,B]/g, "")
        const totalAwards = Number.parseFloat(totalAwardsStr)
        return totalAwards >= minContractValue && totalAwards <= maxContractValue
      })

      setSearchResults(filteredResults)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setSelectedContractor(null)
  }

  const selectContractor = (contractor) => {
    setSelectedContractor(contractor)
  }

  const handleFilterChange = (category, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      location: [],
      states: [],
      sector: [],
      contractValueMin: 0,
      contractValueMax: 100,
      lifecycleStage: [],
      businessMomentum: [],
      ownership: [],
    })
    setContractValueMin(0)
    setContractValueMax(100)
  }

  const handleAgencyClick = (agency) => {
    setSearchQuery(agency)
    setActiveMode("identify")
    setSelectedContractor(null)
    setSearchResults(sampleSearchResults)
  }

  // Handle deployment analysis
  const handleDeployAnalysis = (contractor) => {
    setAnalysisContractor(contractor)
    setActiveMode("analysis")
  }

  // Execute deployment
  const executeDeployment = (deploymentOption) => {
    setSelectedAnalysis(deploymentOption)
    setActiveDeployment({
      id: `dep_${Date.now()}`,
      type: deploymentOption.id,
      title: deploymentOption.title,
      contractor: analysisContractor,
      status: "running",
      startTime: new Date(),
      query: deploymentOption.query(analysisContractor),
    })

    // Simulate deployment execution
    setTimeout(() => {
      setActiveDeployment((prev) => ({ ...prev, status: "completed" }))
      setDeploymentResults({
        summary: `Analysis completed for ${analysisContractor.name}`,
        metrics: {
          revenue: "$2.3B",
          growth: "+24%",
          pipeline: "$12.7B",
        },
        charts: {
          timeSeries: [],
          crossSection: [],
          agencyBreakdown: [],
        },
      })
    }, 3000)
  }

  // Add to portfolio
  const addToPortfolio = (contractor) => {
    if (portfolioContractors.some(c => c.uei === contractor.uei)) {
      // Remove from portfolio if already added
      setPortfolioContractors(prev => prev.filter(c => c.uei !== contractor.uei))
    } else {
      // Add to portfolio
      setPortfolioContractors(prev => [...prev, contractor])
    }
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    return (
      activeFilters.location.length +
      activeFilters.states.length +
      activeFilters.sector.length +
      activeFilters.lifecycleStage.length +
      activeFilters.businessMomentum.length +
      activeFilters.ownership.length +
      (contractValueMin > 0 || contractValueMax < 100 ? 1 : 0)
    )
  }

  const filterConfigs = [
    {
      id: "contractValue",
      label: "Awards",
      icon: <BarChart3 className="w-3 h-3" />,
      hasActive: contractValueMin > 0 || contractValueMax < 100,
      activeCount: contractValueMin > 0 || contractValueMax < 100 ? 1 : 0,
    },
    {
      id: "location",
      label: "Location",
      icon: <Globe className="w-3 h-3" />,
      hasActive: activeFilters.location.length > 0 || activeFilters.states.length > 0,
      activeCount: activeFilters.location.length + activeFilters.states.length,
    },
    {
      id: "sector",
      label: "Industry",
      icon: <Building2 className="w-3 h-3" />,
      hasActive: activeFilters.sector.length > 0,
      activeCount: activeFilters.sector.length,
    },
    {
      id: "lifecycle",
      label: "Lifecycle",
      icon: <TrendingUp className="w-3 h-3" />,
      hasActive: activeFilters.lifecycleStage.length > 0,
      activeCount: activeFilters.lifecycleStage.length,
    },
    {
      id: "momentum",
      label: "Momentum",
      icon: <Activity className="w-3 h-3" />,
      hasActive: activeFilters.businessMomentum.length > 0,
      activeCount: activeFilters.businessMomentum.length,
    },
    {
      id: "ownership",
      label: "Ownership",
      icon: <Building2 className="w-3 h-3" />,
      hasActive: activeFilters.ownership.length > 0,
      activeCount: activeFilters.ownership.length,
    },
  ]

  // 1. Add a ref for the search input at the top of QueryPage
  const searchInputRef = useRef(null);

  // 2. Add useEffect to focus the input on page load and when switching to identify mode
  useEffect(() => {
    if (activeMode === 'identify' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeMode]);

  return (
    <div className="min-h-screen bg-black text-white font-aptos">
      {/* Header */}
      <header className="border-b border-gray-800" style={{ borderColor: "#333" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => {
                setActiveMode("identify")
                clearSearch()
                setSelectedContractor(null)
                setAnalysisContractor(null)
                setSelectedAnalysis(null)
                setActiveDeployment(null)
                setDeploymentResults(null)
              }}
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-michroma logo-text" style={{ color: "#D2AC38" }}>
                Goldengate
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-medium midas-text"
                style={{ color: "#D2AC38", position: "relative", top: "0px" }}
              >
                Midas
              </span>
              <Badge
                variant="outline"
                className="text-xs font-aptos"
                style={{
                  color: "#10B981",
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                }}
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Always Visible except in analysis mode */}
        {activeMode !== "analysis" && (
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4 hero-tagline" style={{ color: "#FFFFFF" }}>
              Autonomous Intelligence
              <br />
              <span style={{ color: "#D2AC38" }}>for Institutional Allocators</span>
            </h1>
            <p className="text-xl text-gray-400 font-aptos">
              Identify and analyze selected federal contractors.
            </p>
          </div>
        )}

        {/* Mode Selection - Always Visible except in analysis mode */}
        {activeMode !== "analysis" && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full p-1" style={{ backgroundColor: "#1A1A1A" }}>
              <button
                onClick={() => {
                  setActiveMode("identify")
                  clearSearch()
                }}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all font-aptos ${
                  activeMode === "identify" ? "text-black" : "text-gray-400 hover:text-white"
                }`}
                style={{
                  backgroundColor: activeMode === "identify" ? "#D2AC38" : "transparent",
                }}
              >
                Identify Targets
              </button>
              <button
                onClick={() => {
                  setActiveMode("portfolio")
                  clearSearch()
                }}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all font-aptos ${
                  activeMode === "portfolio" ? "text-black" : "text-gray-400 hover:text-white"
                }`}
                style={{
                  backgroundColor: activeMode === "portfolio" ? "#D2AC38" : "transparent",
                }}
              >
                View Portfolio
              </button>
            </div>
          </div>
        )}

        {/* Analysis Mode - Full Page Analysis Workflow */}
        {activeMode === "analysis" && analysisContractor && (
          <AnalysisWorkflow
            contractor={analysisContractor}
            deploymentOptions={deploymentOptions}
            selectedAnalysis={selectedAnalysis}
            activeDeployment={activeDeployment}
            deploymentResults={deploymentResults}
            onBack={() => {
              setActiveMode("identify")
              setAnalysisContractor(null)
              setSelectedAnalysis(null)
              setActiveDeployment(null)
              setDeploymentResults(null)
            }}
            onSelectAnalysis={executeDeployment}
            onAddToPortfolio={addToPortfolio}
            portfolioContractors={portfolioContractors}
            setSelectedAnalysis={setSelectedAnalysis}
            setActiveDeployment={setActiveDeployment}
            setDeploymentResults={setDeploymentResults}
          />
        )}

        {/* Search Bar - Show in identify mode */}
        {activeMode === "identify" && (
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch}>
              <div className={`relative transition-all duration-300 ${isSearchFocused ? "scale-[1.02]" : ""}`}>
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by contractor name, UEI, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full h-12 pl-12 pr-32 text-lg font-aptos border-2 focus:border-2 border-white focus:border-white focus:outline-none transition-all"
                  style={{
                    backgroundColor: "#0F0F0F",
                    borderColor: "#FFFFFF",
                    color: "#FFFFFF",
                    borderWidth: 2,
                  }}
                />
                <div className="absolute right-1 top-1 flex items-center gap-1">
                  {searchQuery && (
                    <Button
                      type="button"
                      onClick={clearSearch}
                      size="sm"
                      variant="ghost"
                      className="h-10 px-2"
                      style={{ color: "#999" }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Filter Button */}
                  <div className="relative">
                    <Button
                      type="button"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      size="sm"
                      variant="ghost"
                      className="h-10 px-3 relative"
                      style={{ color: "#999" }}
                    >
                      <Filter className="w-4 h-4" />
                      {getActiveFilterCount() > 0 && (
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                          style={{ backgroundColor: "#D2AC38", color: "#000" }}
                        >
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Search/Go Button */}
                  <Button type="submit" className="h-10 px-4" style={{ backgroundColor: "#D2AC38", color: "#000" }}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Filter Section - Horizontal Bar */}
        {activeMode === "identify" && showFilterDropdown && (
          <div className="max-w-6xl mx-auto mb-8">
            <div
              ref={filterDropdownRef}
              className="rounded-xl border shadow-2xl backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.95)",
                borderColor: "#D2AC38",
                borderWidth: "1px",
              }}
            >
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#333" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#D2AC38" }}
                  >
                    <Filter className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white font-aptos">Filters</h3>
                    <p className="text-xs text-gray-400 font-aptos">
                      {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} active` : "Click to configure"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs px-3 py-1 rounded-lg border transition-colors font-aptos"
                      style={{
                        borderColor: "#D2AC38",
                        color: "#D2AC38",
                        backgroundColor: "transparent",
                      }}
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Filter Bar */}
              <div className="p-4">
                <FilterBar
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  handleFilterChange={handleFilterChange}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  contractValueMin={contractValueMin}
                  setContractValueMin={setContractValueMin}
                  contractValueMax={contractValueMax}
                  setContractValueMax={setContractValueMax}
                />
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center p-4 border-t" style={{ borderColor: "#333" }}>
                <div className="text-sm text-gray-400 font-aptos">
                  {getActiveFilterCount() > 0
                    ? `${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? "s" : ""} will be applied`
                    : "No filters selected"}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowFilterDropdown(false)}
                    variant="outline"
                    className="bg-transparent font-aptos"
                    style={{ borderColor: "#666", color: "#999" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFilterDropdown(false)
                      handleSearch({ preventDefault: () => {} })
                    }}
                    className="font-aptos px-8"
                    style={{ backgroundColor: "#D2AC38", color: "#000" }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Area */}
        {activeMode === "identify" && !searchResults && !selectedContractor && (
          <div className="space-y-8">
            {/* Popular Searches */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase mb-3 flex items-center justify-center gap-2 font-aptos">
                <Target className="w-3 h-3" />
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { text: "Small business IT contractors", icon: <Cpu className="w-3 h-3" /> },
                  { text: "Large defense primes", icon: <Shield className="w-3 h-3" /> },
                  { text: "Emerging AI/ML contractors", icon: <Cpu className="w-3 h-3" /> },
                  { text: "Recent first-time winners", icon: <TrendingUp className="w-3 h-3" /> },
                ].map((search) => (
                  <button
                    key={search.text}
                    onClick={() => setSearchQuery(search.text)}
                    className="px-4 py-1.5 text-sm border rounded-full hover:border-yellow-600 transition-colors flex items-center gap-2 group font-aptos"
                    style={{
                      borderColor: "#333",
                      color: "#999",
                    }}
                  >
                                            <span className="group-hover:text-[#D2AC38] transition-colors">{search.icon}</span>
                    <span className="group-hover:text-white transition-colors">{search.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {activeMode === "identify" && searchResults && !selectedContractor && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white font-aptos">{searchResults.length} contractors found</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-aptos">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="bg-black border border-gray-600 text-white text-sm rounded px-2 py-1 font-aptos"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-400 hover:text-white transition-colors font-aptos"
                >
                  Clear results
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div style={{ border: '1px solid #D2AC38', borderRadius: '8px', overflow: 'hidden' }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "#333" }}>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Company Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">UEI</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Sector</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Primary NAICS</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Total Awards</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Lifecycle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Momentum</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 font-aptos">Ownership</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((contractor, index) => (
                        <tr
                          key={contractor.uei}
                          onClick={() => selectContractor(contractor)}
                          className="border-b hover:bg-gray-800/50 cursor-pointer transition-colors"
                          style={{
                            borderColor: "#333",
                            backgroundColor: index % 2 === 0 ? "#0F0F0F" : "#1A1A1A",
                          }}
                        >
                          <td className="py-4 px-4">
                            <span className="text-white font-medium hover:text-[#D2AC38] transition-colors font-aptos">
                              {contractor.name}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">{contractor.uei}</td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">
                            {contractor.location === "CA, USA"
                              ? "California, USA"
                              : contractor.location === "VA, USA"
                                ? "Virginia, USA"
                                : contractor.location === "MA, USA"
                                  ? "Massachusetts, USA"
                                  : contractor.location}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">{contractor.sector}</td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">{contractor.primaryNAICS}</td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">{contractor.totalAwards}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-aptos ${
                                contractor.lifecycleStage === "New"
                                  ? "bg-red-500/20 text-red-400"
                                  : contractor.lifecycleStage === "Emerging"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : contractor.lifecycleStage === "Established"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {contractor.lifecycleStage}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-aptos ${
                                contractor.businessMomentum === "Explosive"
                                  ? "bg-green-500/20 text-green-400"
                                  : contractor.businessMomentum === "Robust"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : contractor.businessMomentum === "Stable"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {contractor.businessMomentum}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300 font-aptos">{contractor.ownership}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {searchResults.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400 font-aptos">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-aptos"
                    style={{ borderColor: "#333", color: "#999" }}
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(searchResults.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter((page) => {
                        const totalPages = Math.ceil(searchResults.length / itemsPerPage)
                        if (totalPages <= 7) return true
                        if (page <= 3) return true
                        if (page >= totalPages - 2) return true
                        if (Math.abs(page - currentPage) <= 1) return true
                        return false
                      })
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-500 font-aptos">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm border rounded transition-colors font-aptos ${
                              currentPage === page
                                ? "bg-yellow-600 border-yellow-600 text-black"
                                : "border-gray-600 text-gray-300 hover:bg-gray-800"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(Math.ceil(searchResults.length / itemsPerPage), currentPage + 1))
                    }
                    disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-aptos"
                    style={{ borderColor: "#333", color: "#999" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Contractor Detail */}
        {activeMode === "identify" && selectedContractor && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              onClick={() => setSelectedContractor(null)}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-aptos"
            >
              ← Back to results
            </button>

            {/* Contractor Profile */}
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: "#0F0F0F",
                borderColor: "#333",
              }}
            >
              <div className="flex items-start gap-6 mb-6">
                {/* Large Sector Avatar */}
                <div className="flex-shrink-0" style={{ width: "calc(25% - 12px)" }}>
                  <img
                    src={getSectorAvatar(selectedContractor.sector) || "/placeholder.svg"}
                    alt={`${selectedContractor.sector} sector`}
                    className="w-full rounded-lg object-cover"
                    style={{ aspectRatio: "1/1", height: "auto" }}
                  />
                </div>

                {/* Company Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-aptos">{selectedContractor.name}</h2>
                    <p className="text-sm text-gray-500 mb-4 font-aptos">UEI: {selectedContractor.uei}</p>
                    <p className="text-gray-400 mb-4 leading-relaxed font-aptos">{selectedContractor.description}</p>

                    {/* Industry/Location/Age row - aligned with bottom of image */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-aptos">Industry</p>
                        <p className="text-white font-aptos">{selectedContractor.sector}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-aptos">Location</p>
                        <p className="text-white font-aptos">
                          {selectedContractor.location === "CA, USA"
                            ? "California, USA"
                            : selectedContractor.location === "VA, USA"
                              ? "Virginia, USA"
                              : selectedContractor.location === "MA, USA"
                                ? "Massachusetts, USA"
                                : selectedContractor.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-aptos">Years Since First Contract</p>
                        <p className="text-white font-aptos">{selectedContractor.ageSinceFirstContract} Years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Definitive Contracts",
                    value: "$4.2B | 147 AWDs",
                    description: "Total value and number of definitive active contracts",
                  },
                  {
                    label: "Outlays to Date",
                    value: "$2.8B",
                    description: "Recorded disbursements on definitive active contracts",
                  },
                  {
                    label: "Remaining Balance",
                    value: "$1.4B",
                    description: "Addressable balance on definitive active contracts",
                  },
                  {
                    label: "Indefinite Vehicles",
                    value: "$8.5B | 12 IDVs",
                    description: "Total ceiling and number of active indefinite vehicles",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                    <p className="text-sm text-gray-500 mb-2 font-aptos">{stat.label}</p>
                    <p className="text-lg font-semibold text-white font-aptos">
                      {stat.label === "Definitive Contracts" ? (
                        <>
                          $4.2B <span className="text-gray-500">{" | "}</span> 147 AWDs
                        </>
                      ) : stat.label === "Indefinite Vehicles" ? (
                        <>
                          $8.5B <span className="text-gray-500">{" | "}</span> 12 IDVs
                        </>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs text-gray-400 leading-tight mt-2 font-aptos">{stat.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Additional Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4 font-aptos">Additional Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-aptos">Definitive Contract Awards (TTM)</p>
                      <p className="text-sm text-white font-aptos">
                        24 Awards <span className="text-xs text-green-400">+18% YoY</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-aptos">Lifecycle Stage</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-aptos ${
                          selectedContractor.lifecycleStage === "New"
                            ? "bg-red-500/20 text-red-400"
                            : selectedContractor.lifecycleStage === "Emerging"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : selectedContractor.lifecycleStage === "Established"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {selectedContractor.lifecycleStage}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-aptos">Value-Weighted Duration</p>
                      <p className="text-sm text-white font-aptos">3.2 Years</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-aptos">Business Momentum</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-aptos ${
                          selectedContractor.businessMomentum === "Explosive"
                            ? "bg-green-500/20 text-green-400"
                            : selectedContractor.businessMomentum === "Robust"
                              ? "bg-blue-500/20 text-blue-400"
                              : selectedContractor.businessMomentum === "Stable"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {selectedContractor.businessMomentum}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Mix */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4 font-aptos">Portfolio Mix</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Agency Breakdown Pie Chart */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-aptos">Awarding Agencies</p>
                      <div className="flex items-start gap-3">
                        {/* Pie Chart - Fixed position */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="absolute inset-0 bg-yellow-500"
                            style={{
                              clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 45%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-blue-500"
                            style={{
                              clipPath: "polygon(50% 50%, 100% 45%, 100% 100%, 80% 100%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-green-500"
                            style={{
                              clipPath: "polygon(50% 50%, 80% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)",
                            }}
                          ></div>
                        </div>

                        {/* Legend - Fixed position with proper alignment */}
                        <div className="text-xs space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                              <button
                                onClick={() => handleAgencyClick("DOD")}
                                className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors cursor-pointer font-aptos"
                              >
                                DOD
                              </button>
                            </div>
                            <span className="text-gray-400 text-xs font-aptos">45%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <button
                                onClick={() => handleAgencyClick("CIA")}
                                className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer font-aptos"
                              >
                                CIA
                              </button>
                            </div>
                            <span className="text-gray-400 text-xs font-aptos">30%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <button
                                onClick={() => handleAgencyClick("HHS")}
                                className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors cursor-pointer font-aptos"
                              >
                                HHS
                              </button>
                            </div>
                            <span className="text-gray-400 text-xs font-aptos">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Type Breakdown Pie Chart */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-aptos">Pipeline Breakdown</p>
                      <div className="flex items-start gap-3">
                        {/* Pie Chart - Left aligned with title */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="absolute inset-0 bg-orange-500"
                            style={{
                              clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 20% 100%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-purple-500"
                            style={{
                              clipPath: "polygon(50% 50%, 20% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)",
                            }}
                          ></div>
                        </div>

                        {/* Legend - Right aligned like agency percentages */}
                        <div className="text-xs space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                              <span className="text-gray-400 font-aptos">Definitive</span>
                            </div>
                            <span className="text-gray-400 text-xs font-aptos">62%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                              <span className="text-gray-400 font-aptos">Indefinite</span>
                            </div>
                            <span className="text-gray-400 text-xs font-aptos">38%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#333" }}>
                <Button
                  onClick={() => handleDeployAnalysis(selectedContractor)}
                  className="flex-1 font-aptos"
                  style={{ backgroundColor: "#D2AC38", color: "#000" }}
                >
                  Deploy Analysis
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent font-aptos"
                  style={{ borderColor: "#D2AC38", color: "#D2AC38" }}
                >
                  Add to Portfolio
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Mode */}
        {activeMode === "portfolio" && (
          <div className="max-w-3xl mx-auto">
            {portfolioCompanies.length > 0 ? (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (active.id !== over?.id) {
                    setPortfolioCompanies((items) => {
                      const oldIndex = items.findIndex((c) => c.uei === active.id);
                      const newIndex = items.findIndex((c) => c.uei === over.id);
                      return arrayMove(items, oldIndex, newIndex);
                    });
                  }
                }}
              >
                <SortableContext items={portfolioCompanies.map((c) => c.uei)} strategy={verticalListSortingStrategy}>
                  {portfolioCompanies.map((company) => (
                    <SortablePortfolioItem
                      key={company.uei}
                      company={company}
                      onClick={() => {
                        setSelectedContractor({ ...company });
                        setActiveMode("identify");
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4 font-aptos">No portfolio companies added yet</p>
                <Button
                  variant="outline"
                  className="font-aptos bg-transparent"
                  style={{ borderColor: "#D2AC38", color: "#D2AC38" }}
                  onClick={() => setActiveMode('identify')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Company
                </Button>
              </div>
            )}
            <button
              className="w-full p-5 text-center rounded-lg border border-dashed hover:border-yellow-600 transition-colors font-aptos"
              style={{ backgroundColor: "transparent", borderColor: "#333", color: "#666" }}
              onClick={() => setActiveMode('identify')}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Company to Portfolio
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

// Analysis Workflow Component
const AnalysisWorkflow = ({
  contractor,
  deploymentOptions,
  selectedAnalysis,
  activeDeployment,
  deploymentResults,
  onBack,
  onSelectAnalysis,
  onAddToPortfolio,
  portfolioContractors,
  setSelectedAnalysis,
  setActiveDeployment,
  setDeploymentResults,
}) => {
  const [queryText, setQueryText] = useState("")
  const [notes, setNotes] = useState([])

  // New state for the analysis controls
  const [timePeriod, setTimePeriod] = useState("3Y")
  const [timeInterval, setTimeInterval] = useState("Quarter")
  const [growthMetric, setGrowthMetric] = useState("Revenue")
  const [peerComparisonView, setPeerComparisonView] = useState("Current")
  const [peerSortColumn, setPeerSortColumn] = useState("overallScore")
  const [peerSortDirection, setPeerSortDirection] = useState("DESC")
  const [showExportModal, setShowExportModal] = useState(false)

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-[#D2AC38]"
    return "text-red-400"
  }

  const getDeltaColor = (value) => {
    if (peerComparisonView === "Delta") {
      // Check if the value contains a percentage or dollar sign
      if (typeof value === "string") {
        if (value.includes("+")) return "text-green-400"
        if (value.includes("-")) return "text-red-400"
        // For values without explicit +/-, try to parse
        const numValue = parseFloat(value.replace(/[$,%]/g, ""))
        if (!isNaN(numValue)) {
          return numValue > 0 ? "text-green-400" : numValue < 0 ? "text-red-400" : "text-gray-300"
        }
      }
      
    }
    return "text-gray-300"
  }

  const getRiskColor = (rating) => {
    switch (rating) {
      case "LOW":
        return "text-green-400"
      case "MODERATE":
        return "text-yellow-400"
      case "HIGH":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const addNote = (content) => {
    const note = {
      id: Date.now(),
      content,
      author: "user@email.com",
      timestamp: new Date(),
      tags: content.match(/#\w+/g) || [],
    }
    setNotes([note, ...notes])
  }

  // Sample data for the analysis
  const headlineFigures = [
    { title: "Pipeline Valuation", value: "$12.7B", delta: "+18%", period: "(YoY)" },
    { title: "Estimated Contract Revenue", value: "$2.8B", delta: "+24%", period: "(TTM)" },
    { title: "Market Share", value: "3.2%", delta: "+0.8%", period: "(YoY)" },
    { title: "Win Rate", value: "67%", delta: "+12%", period: "(YoY)" },
  ]

  const overallGrowthPerformance = {
    score: 85,
    percentileRank: 92,
    peerCount: 32,
    subScores: {
      pipeline: { score: 95, delta: "+22%" },
      revenue: { score: 88, delta: "+24%" },
      marketShare: { score: 75, delta: "+0.8%" },
      winRate: { score: 82, delta: "+12%" },
    },
  }

  const peerComparisonData = [
    {
      name: contractor.name,
      overallScore: 85,
      pipeline: { current: "$12.7B", delta: "+22%" },
      revenue: { current: "$2.8B", delta: "+24%" },
      marketShare: { current: "3.2%", delta: "+0.8%" },
      winRate: { current: "67%", delta: "+12%" },
      isCurrent: true,
    },
    {
      name: "Booz Allen Hamilton",
      overallScore: 78,
      pipeline: { current: "$25.1B", delta: "+15%" },
      revenue: { current: "$8.4B", delta: "+12%" },
      marketShare: { current: "5.1%", delta: "+0.5%" },
      winRate: { current: "58%", delta: "-2%" },
    },
    {
      name: "CACI International",
      overallScore: 72,
      pipeline: { current: "$18.9B", delta: "+10%" },
      revenue: { current: "$6.2B", delta: "+8%" },
      marketShare: { current: "4.3%", delta: "+0.3%" },
      winRate: { current: "61%", delta: "+3%" },
    },
    {
      name: "SAIC",
      overallScore: 68,
      pipeline: { current: "$15.5B", delta: "+12%" },
      revenue: { current: "$7.1B", delta: "+15%" },
      marketShare: { current: "4.0%", delta: "+0.4%" },
      winRate: { current: "55%", delta: "-5%" },
    },
    {
      name: "Leidos",
      overallScore: 76,
      pipeline: { current: "$22.3B", delta: "+18%" },
      revenue: { current: "$9.1B", delta: "+16%" },
      marketShare: { current: "4.8%", delta: "+0.7%" },
      winRate: { current: "62%", delta: "+4%" },
    },
    {
      name: "General Dynamics",
      overallScore: 74,
      pipeline: { current: "$28.7B", delta: "+14%" },
      revenue: { current: "$10.2B", delta: "+11%" },
      marketShare: { current: "5.4%", delta: "+0.6%" },
      winRate: { current: "59%", delta: "+1%" },
    },
    {
      name: "Raytheon Technologies",
      overallScore: 71,
      pipeline: { current: "$31.5B", delta: "+13%" },
      revenue: { current: "$11.8B", delta: "+9%" },
      marketShare: { current: "5.7%", delta: "+0.4%" },
      winRate: { current: "56%", delta: "-3%" },
    },
    {
      name: "Lockheed Martin",
      overallScore: 69,
      pipeline: { current: "$35.2B", delta: "+11%" },
      revenue: { current: "$13.4B", delta: "+8%" },
      marketShare: { current: "6.1%", delta: "+0.3%" },
      winRate: { current: "54%", delta: "-2%" },
    },
    {
      name: "Northrop Grumman",
      overallScore: 67,
      pipeline: { current: "$29.8B", delta: "+12%" },
      revenue: { current: "$12.1B", delta: "+10%" },
      marketShare: { current: "5.5%", delta: "+0.5%" },
      winRate: { current: "53%", delta: "-1%" },
    },
    {
      name: "Boeing",
      overallScore: 65,
      pipeline: { current: "$33.1B", delta: "+9%" },
      revenue: { current: "$14.7B", delta: "+7%" },
      marketShare: { current: "6.3%", delta: "+0.2%" },
      winRate: { current: "51%", delta: "-4%" },
    },
    {
      name: "L3Harris Technologies",
      overallScore: 73,
      pipeline: { current: "$19.6B", delta: "+16%" },
      revenue: { current: "$7.8B", delta: "+14%" },
      marketShare: { current: "4.5%", delta: "+0.6%" },
      winRate: { current: "60%", delta: "+5%" },
    },
    {
      name: "Huntington Ingalls",
      overallScore: 70,
      pipeline: { current: "$16.8B", delta: "+13%" },
      revenue: { current: "$6.9B", delta: "+12%" },
      marketShare: { current: "4.2%", delta: "+0.4%" },
      winRate: { current: "57%", delta: "+2%" },
    },
    {
      name: "Parsons Corporation",
      overallScore: 66,
      pipeline: { current: "$14.2B", delta: "+11%" },
      revenue: { current: "$5.4B", delta: "+13%" },
      marketShare: { current: "3.8%", delta: "+0.3%" },
      winRate: { current: "52%", delta: "-3%" },
    },
    {
      name: "ManTech International",
      overallScore: 64,
      pipeline: { current: "$13.7B", delta: "+10%" },
      revenue: { current: "$5.1B", delta: "+9%" },
      marketShare: { current: "3.6%", delta: "+0.2%" },
      winRate: { current: "50%", delta: "-5%" },
    },
    {
      name: "Peraton",
      overallScore: 62,
      pipeline: { current: "$12.9B", delta: "+8%" },
      revenue: { current: "$4.8B", delta: "+11%" },
      marketShare: { current: "3.4%", delta: "+0.1%" },
      winRate: { current: "48%", delta: "-7%" },
    },
    {
      name: "Jacobs Engineering",
      overallScore: 75,
      pipeline: { current: "$20.4B", delta: "+17%" },
      revenue: { current: "$8.7B", delta: "+15%" },
      marketShare: { current: "4.6%", delta: "+0.8%" },
      winRate: { current: "63%", delta: "+6%" },
    },
    {
      name: "AECOM",
      overallScore: 63,
      pipeline: { current: "$13.1B", delta: "+9%" },
      revenue: { current: "$5.2B", delta: "+10%" },
      marketShare: { current: "3.5%", delta: "+0.2%" },
      winRate: { current: "49%", delta: "-6%" },
    },
    {
      name: "Fluor Corporation",
      overallScore: 61,
      pipeline: { current: "$12.3B", delta: "+7%" },
      revenue: { current: "$4.5B", delta: "+8%" },
      marketShare: { current: "3.3%", delta: "+0.1%" },
      winRate: { current: "47%", delta: "-8%" },
    },
    {
      name: "Bechtel Corporation",
      overallScore: 59,
      pipeline: { current: "$11.8B", delta: "+6%" },
      revenue: { current: "$4.2B", delta: "+7%" },
      marketShare: { current: "3.1%", delta: "+0.0%" },
      winRate: { current: "45%", delta: "-9%" },
    },
    {
      name: "KBR",
      overallScore: 77,
      pipeline: { current: "$21.7B", delta: "+19%" },
      revenue: { current: "$9.3B", delta: "+17%" },
      marketShare: { current: "4.9%", delta: "+0.9%" },
      winRate: { current: "64%", delta: "+7%" },
    },
    {
      name: "Science Applications",
      overallScore: 58,
      pipeline: { current: "$11.2B", delta: "+5%" },
      revenue: { current: "$3.9B", delta: "+6%" },
      marketShare: { current: "2.9%", delta: "-0.1%" },
      winRate: { current: "44%", delta: "-10%" },
    },
    {
      name: "Maximus",
      overallScore: 56,
      pipeline: { current: "$10.8B", delta: "+4%" },
      revenue: { current: "$3.6B", delta: "+5%" },
      marketShare: { current: "2.7%", delta: "-0.2%" },
      winRate: { current: "42%", delta: "-11%" },
    },
    {
      name: "ICF International",
      overallScore: 54,
      pipeline: { current: "$10.3B", delta: "+3%" },
      revenue: { current: "$3.3B", delta: "+4%" },
      marketShare: { current: "2.5%", delta: "-0.3%" },
      winRate: { current: "40%", delta: "-12%" },
    },
    {
      name: "Guidehouse",
      overallScore: 52,
      pipeline: { current: "$9.8B", delta: "+2%" },
      revenue: { current: "$3.0B", delta: "+3%" },
      marketShare: { current: "2.3%", delta: "-0.4%" },
      winRate: { current: "38%", delta: "-13%" },
    },
    {
      name: "Deloitte Consulting",
      overallScore: 50,
      pipeline: { current: "$9.2B", delta: "+1%" },
      revenue: { current: "$2.7B", delta: "+2%" },
      marketShare: { current: "2.1%", delta: "-0.5%" },
      winRate: { current: "36%", delta: "-14%" },
    },
    {
      name: "Accenture Federal",
      overallScore: 48,
      pipeline: { current: "$8.7B", delta: "+0%" },
      revenue: { current: "$2.4B", delta: "+1%" },
      marketShare: { current: "1.9%", delta: "-0.6%" },
      winRate: { current: "34%", delta: "-15%" },
    },
    {
      name: "McKinsey & Company",
      overallScore: 46,
      pipeline: { current: "$8.1B", delta: "-1%" },
      revenue: { current: "$2.1B", delta: "+0%" },
      marketShare: { current: "1.7%", delta: "-0.7%" },
      winRate: { current: "32%", delta: "-16%" },
    },
    {
      name: "BCG Federal",
      overallScore: 44,
      pipeline: { current: "$7.6B", delta: "-2%" },
      revenue: { current: "$1.8B", delta: "-1%" },
      marketShare: { current: "1.5%", delta: "-0.8%" },
      winRate: { current: "30%", delta: "-17%" },
    },
    {
      name: "Bain & Company",
      overallScore: 42,
      pipeline: { current: "$7.0B", delta: "-3%" },
      revenue: { current: "$1.5B", delta: "-2%" },
      marketShare: { current: "1.3%", delta: "-0.9%" },
      winRate: { current: "28%", delta: "-18%" },
    },
    {
      name: "Peer Median",
      isMedian: true,
      overallScore: 75,
      pipeline: { current: "$17.2B", delta: "+13%" },
      revenue: { current: "$6.7B", delta: "+13.5%" },
      marketShare: { current: "4.1%", delta: "+0.35%" },
      winRate: { current: "59.5%", delta: "+0.5%" },
    },
  ]

  const handlePeerSort = (column) => {
    if (peerSortColumn === column) {
      setPeerSortDirection(peerSortDirection === "ASC" ? "DESC" : "ASC")
    } else {
      setPeerSortColumn(column)
      setPeerSortDirection("DESC")
    }
  }

  const sortedPeerData = [...peerComparisonData].sort((a, b) => {
    let aVal, bVal
    if (peerSortColumn === "overallScore") {
      aVal = a.overallScore
      bVal = b.overallScore
    } else {
      const parseValue = (val) => {
        if (typeof val !== "string") return 0
        return Number.parseFloat(val.replace(/[$,%B]/g, ""))
      }
      aVal = parseValue(a[peerSortColumn][peerComparisonView.toLowerCase()])
      bVal = parseValue(b[peerSortColumn][peerComparisonView.toLowerCase()])
    }

    if (peerSortDirection === "ASC") {
      return aVal - bVal
    } else {
      return bVal - aVal
    }
  })

  const timeSeriesData = [
    { period: "Q1 '23", revenue: 2.8, pipeline: 13.2 },
    { period: "Q2 '23", revenue: 3.0, pipeline: 13.8 },
    { period: "Q3 '23", revenue: 3.2, pipeline: 14.1 },
    { period: "Q4 '23", revenue: 3.5, pipeline: 14.8 },
    { period: "Q1 '24", revenue: 3.6, pipeline: 15.4 },
    { period: "Q2 '24", revenue: 3.9, pipeline: 15.9 },
    { period: "Q3 '24", revenue: 4.1, pipeline: 16.4 },
    { period: "Q4 '24", revenue: 4.3, pipeline: 16.9 },
    { period: "Q1 '25", revenue: 4.5, pipeline: 17.3 },
    { period: "Q2 '25", revenue: 4.7, pipeline: 17.8 },
    { period: "Q3 '25", revenue: 4.9, pipeline: 18.2 },
  ]

  // If no analysis selected, show selection page
  if (!selectedAnalysis) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-aptos"
        >
          ← Back to contractor
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 font-aptos" style={{ color: "#FFFFFF" }}>
            Deploy Analysis for {contractor.name}
          </h1>
          <p className="text-gray-400 font-aptos">Choose an analysis to run</p>
        </div>

        {/* Analysis Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deploymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectAnalysis(option)}
              disabled={option.disabled}
              className={`p-6 text-left rounded-lg border transition-all group ${
                option.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-600"
              }`}
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
                <h3 className="font-semibold text-lg text-white font-aptos">{option.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3 font-aptos">{option.description}</p>
              {!option.disabled && (
                                        <span className="text-sm text-[#D2AC38] group-hover:text-[#D2AC38] transition-colors font-aptos">
                  Deploy this analysis →
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Show analysis results page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSelectedAnalysis(null)
            setActiveDeployment(null)
            setDeploymentResults(null)
          }}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4 font-aptos"
        >
          ← Back to analysis options
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 font-aptos">
              {contractor.name} <span className="text-gray-400">{" | "}</span> {selectedAnalysis.title}
            </h2>
            <p className="text-gray-400 font-aptos">
              {activeDeployment?.status === "running" ? "Running..." : "Completed"} {" • "}
              {activeDeployment ? new Date(activeDeployment.startTime).toLocaleString() : "Ready to start"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => onAddToPortfolio(contractor)}
              className="font-aptos"
              style={{ 
                backgroundColor: (portfolioContractors || []).some(c => c.uei === contractor.uei) ? "#D2AC38" : "#C0C0C0", 
                color: (portfolioContractors || []).some(c => c.uei === contractor.uei) ? "#000" : "#333" 
              }}
            >
              {(portfolioContractors || []).some(c => c.uei === contractor.uei) ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
              <Plus className="w-4 h-4 mr-2" />
              )}
              {(portfolioContractors || []).some(c => c.uei === contractor.uei) ? "Saved to Portfolio" : "Save to Portfolio"}
            </Button>
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="font-aptos bg-transparent"
              style={{ borderColor: "#666", color: "#999" }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeDeployment?.status === "running" ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-400 font-aptos">Running analysis...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Show Forensic Due Diligence Dashboard if selected */}
          {selectedAnalysis.id === "forensic-diligence" ? (
            <ForensicDueDiligenceDashboard contractor={contractor} />
          ) : (
            <>
              {/* Executive Summary */}
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: "#0F0F0F",
                  borderColor: "#333",
                }}
              >
                <h3 className="text-xl font-semibold mb-4 font-aptos">Executive Summary</h3>
                <p className="text-gray-300 leading-relaxed font-aptos">
                  {contractor.name} demonstrates strong market positioning with consistent revenue growth and expanding
                  pipeline valuation. The company's diversified agency portfolio, led by DoD contracts (45%), provides
                  stability while recent wins in emerging technology sectors indicate strategic positioning for future
                  growth. Current pipeline health suggests sustained revenue trajectory with 72% definitive contract
                  weighting providing near-term revenue certainty.
                </p>
              </div>

              {/* Overall Growth Performance */}
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: "#0F0F0F",
                  borderColor: "#333",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h4 className="text-lg font-semibold text-white mb-3 font-aptos">Overall Growth Performance</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl font-bold font-aptos ${getScoreColor(overallGrowthPerformance.score)}`}>
                        {overallGrowthPerformance.score}
                      </div>
                      <div>
                        <p className="text-sm text-white font-aptos">Composite Score</p>
                        <p className="text-xs text-gray-400 mt-1 font-aptos">
                          {overallGrowthPerformance.percentileRank}th percentile versus {overallGrowthPerformance.peerCount} peers
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-4 gap-4 items-center">
                    {Object.entries(overallGrowthPerformance.subScores).map(([key, value]) => (
                      <div key={key} className="text-center p-3 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
                        <div className={`text-2xl font-bold mb-1 font-aptos ${getScoreColor(value.score)}`}>
                          {value.score}
                        </div>
                        <h5 className="text-xs font-medium text-white capitalize mb-1 font-aptos">
                          {key.replace(/([A-Z])/g, " $1")}
                        </h5>
                        <p className="text-xs text-green-400 leading-tight font-aptos">{value.delta} YoY</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Headline Figures */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {headlineFigures.map((figure) => (
                  <div
                    key={figure.title}
                    className="rounded-lg border p-4"
                    style={{
                      backgroundColor: "#0F0F0F",
                      borderColor: "#333",
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-2 font-aptos">{figure.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-white font-aptos">{figure.value}</p>
                      <span className="text-sm text-green-400 font-aptos">{figure.delta}</span>
                      <span className="text-xs text-gray-500 font-aptos">{figure.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Performance Chart */}
                <div
                  className="rounded-lg border p-6"
                  style={{
                    backgroundColor: "#0F0F0F",
                    borderColor: "#333",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white font-aptos">Growth Performance</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGrowthMetric("Revenue")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors font-aptos ${
                          growthMetric === "Revenue"
                            ? "bg-yellow-600 text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        Revenue
                      </button>
                      <button
                        onClick={() => setGrowthMetric("Pipeline")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors font-aptos ${
                          growthMetric === "Pipeline"
                            ? "bg-yellow-600 text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        Pipeline
                      </button>
                    </div>
                  </div>
                  <div className="h-96 relative" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}>
                    {/* MATLAB-style Time Series Chart */}
                    <svg width="100%" height="100%" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="70" height="80" patternUnits="userSpaceOnUse">
                          <path d="M 70 0 L 0 0 0 80" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      
                      {/* Background with grid */}
                      <rect width="100%" height="100%" fill="#1A1A1A"/>
                      <rect width="100%" height="100%" fill="url(#grid)"/>
                      
                      {/* Chart area - properly sized with margins */}
                      <rect x="100" y="40" width="560" height="300" fill="none" stroke="#666" strokeWidth="1"/>
                      
                      {/* Y-axis labels (dollar values) - properly positioned */}
                      <text x="95" y="45" textAnchor="end" fill="#999" fontSize="11" fontFamily="monospace">$4.0B</text>
                      <text x="95" y="125" textAnchor="end" fill="#999" fontSize="11" fontFamily="monospace">$3.0B</text>
                      <text x="95" y="205" textAnchor="end" fill="#999" fontSize="11" fontFamily="monospace">$2.0B</text>
                      <text x="95" y="285" textAnchor="end" fill="#999" fontSize="11" fontFamily="monospace">$1.0B</text>
                      <text x="95" y="365" textAnchor="end" fill="#999" fontSize="11" fontFamily="monospace">$0.0B</text>
                      
                      {/* X-axis labels (years) - properly spaced */}
                      <text x="140" y="385" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">2020</text>
                      <text x="280" y="385" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">2021</text>
                      <text x="420" y="385" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">2022</text>
                      <text x="560" y="385" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">2023</text>
                      <text x="700" y="385" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">2024</text>
                      
                      {/* Data points and line for Revenue */}
                      {growthMetric === "Revenue" && (
                        <>
                          {/* Revenue line */}
                          <path 
                            d="M 140 300 L 280 260 L 420 220 L 560 180 L 700 140" 
                            fill="none" 
                            stroke="#D2AC38" 
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Revenue data points */}
                          <circle cx="140" cy="300" r="4" fill="#D2AC38" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="280" cy="260" r="4" fill="#D2AC38" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="420" cy="220" r="4" fill="#D2AC38" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="560" cy="180" r="4" fill="#D2AC38" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="700" cy="140" r="4" fill="#D2AC38" stroke="#1A1A1A" strokeWidth="1"/>
                          
                          {/* Data labels */}
                          <text x="140" y="295" textAnchor="middle" fill="#D2AC38" fontSize="9" fontFamily="monospace" fontWeight="500">$1.2B</text>
                          <text x="280" y="255" textAnchor="middle" fill="#D2AC38" fontSize="9" fontFamily="monospace" fontWeight="500">$1.8B</text>
                          <text x="420" y="215" textAnchor="middle" fill="#D2AC38" fontSize="9" fontFamily="monospace" fontWeight="500">$2.4B</text>
                          <text x="560" y="175" textAnchor="middle" fill="#D2AC38" fontSize="9" fontFamily="monospace" fontWeight="500">$3.0B</text>
                          <text x="700" y="135" textAnchor="middle" fill="#D2AC38" fontSize="9" fontFamily="monospace" fontWeight="500">$3.6B</text>
                        </>
                      )}
                      
                      {/* Data points and line for Pipeline */}
                      {growthMetric === "Pipeline" && (
                        <>
                          {/* Pipeline line */}
                          <path 
                            d="M 140 260 L 280 220 L 420 180 L 560 140 L 700 100" 
                            fill="none" 
                            stroke="#10B981" 
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Pipeline data points */}
                          <circle cx="140" cy="260" r="4" fill="#10B981" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="280" cy="220" r="4" fill="#10B981" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="420" cy="180" r="4" fill="#10B981" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="560" cy="140" r="4" fill="#10B981" stroke="#1A1A1A" strokeWidth="1"/>
                          <circle cx="700" cy="100" r="4" fill="#10B981" stroke="#1A1A1A" strokeWidth="1"/>
                          
                          {/* Data labels */}
                          <text x="140" y="255" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="500">$8.5B</text>
                          <text x="280" y="215" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="500">$10.2B</text>
                          <text x="420" y="175" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="500">$11.8B</text>
                          <text x="560" y="135" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="500">$12.7B</text>
                          <text x="700" y="95" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="500">$13.5B</text>
                        </>
                      )}
                      
                      {/* Legend */}
                      <rect x="110" y="20" width="15" height="3" fill={growthMetric === "Revenue" ? "#D2AC38" : "#10B981"}/>
                      <text x="130" y="23" fill="#999" fontSize="10" fontFamily="monospace" fontWeight="500">{growthMetric}</text>
                    </svg>
                  </div>
                </div>

                {/* Peer Comparison Table */}
                <div
                  className="rounded-lg border"
                  style={{
                    backgroundColor: "#0F0F0F",
                    borderColor: "#333",
                  }}
                >
                  <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "#333" }}>
                    <h4 className="text-lg font-semibold text-white font-aptos">Peer Comparison</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPeerComparisonView("Current")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors font-aptos ${
                          peerComparisonView === "Current"
                            ? "bg-yellow-600 text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        Current
                      </button>
                      <button
                        onClick={() => setPeerComparisonView("Delta")}
                        className={`px-3 py-1 text-xs rounded-full transition-colors font-aptos ${
                          peerComparisonView === "Delta"
                            ? "bg-yellow-600 text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        Delta
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto" style={{ maxHeight: "384px", overflowY: "auto" }}>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#333", backgroundColor: "rgba(153, 153, 153, 0.1)" }}>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-300 font-aptos" style={{ width: "30%" }}>
                            Contractor
                          </th>
                          <th
                            className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white"
                            style={{ 
                              width: "12%",
                              color: peerSortColumn === "overallScore" ? "#D2AC38" : "#9CA3AF"
                            }}
                            onClick={() => handlePeerSort("overallScore")}
                          >
                            Score
                          </th>
                          <th
                            className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white"
                            style={{ 
                              width: "15%",
                              color: peerSortColumn === "pipeline" ? "#D2AC38" : "#9CA3AF"
                            }}
                            onClick={() => handlePeerSort("pipeline")}
                          >
                            Pipeline
                          </th>
                          <th
                            className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white"
                            style={{ 
                              width: "15%",
                              color: peerSortColumn === "revenue" ? "#D2AC38" : "#9CA3AF"
                            }}
                            onClick={() => handlePeerSort("revenue")}
                          >
                            Revenue
                          </th>
                          <th
                            className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white"
                            style={{ 
                              width: "15%",
                              color: peerSortColumn === "marketShare" ? "#D2AC38" : "#9CA3AF"
                            }}
                            onClick={() => handlePeerSort("marketShare")}
                          >
                            Market Share
                          </th>
                          <th
                            className="text-left py-2 px-3 text-xs font-medium cursor-pointer hover:text-white"
                            style={{ 
                              width: "13%",
                              color: peerSortColumn === "winRate" ? "#D2AC38" : "#9CA3AF"
                            }}
                            onClick={() => handlePeerSort("winRate")}
                          >
                            Win Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPeerData.map((peer, index) => (
                          <tr
                            key={`${peer.name}-${index}`}
                            className="border-b"
                            style={{
                              borderColor: "#333",
                              backgroundColor: peer.isCurrent
                                ? "rgba(210, 172, 56, 0.15)"
                                : peer.isMedian
                                  ? "rgba(153, 153, 153, 0.1)"
                                  : "transparent",
                            }}
                          >
                            <td className="py-2 px-3 text-xs font-aptos">
                              <span
                                className={
                                  peer.isCurrent
                                    ? "font-medium text-yellow-400"
                                    : peer.isMedian
                                      ? "italic text-gray-400"
                                      : "text-white"
                                }
                              >
                                {peer.name}
                              </span>
                            </td>
                            <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : getScoreColor(peer.overallScore)}`}> 
                              {peer.overallScore}
                            </td>
                            <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : "text-gray-300"}`}> 
                              {peerComparisonView === "Delta" ? peer.pipeline?.delta : peer.pipeline?.current}
                            </td>
                            <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : "text-gray-300"}`}> 
                              {peerComparisonView === "Delta" ? peer.revenue?.delta : peer.revenue?.current}
                            </td>
                            <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : "text-gray-300"}`}> 
                              {peerComparisonView === "Delta" ? peer.marketShare?.delta : peer.marketShare?.current}
                            </td>
                            <td className={`py-2 px-3 text-xs font-aptos ${peer.isMedian ? "text-gray-400" : "text-gray-300"}`}> 
                              {peerComparisonView === "Delta" ? peer.winRate?.delta : peer.winRate?.current}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Active Opportunities */}
              <ActiveOpportunities contractor={contractor} />

              {/* Query Interface */}
              <div
                className="rounded-lg border p-4 mt-6"
                style={{
                  backgroundColor: "#1A1A1A",
                  borderColor: "#D2AC38",
                  borderWidth: 3,
                }}
              >
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Ask about the assumptions, audit the presented numbers, or inquire about the methodology..."
                  className="w-full bg-transparent text-white resize-none focus:outline-none font-aptos"
                  style={{ 
                    color: "white",
                    opacity: 1
                  }}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Press ⌘+Enter to submit</span>
                  <Button size="sm" style={{ backgroundColor: "#D2AC38", color: "#000" }} disabled={!queryText.trim()}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const sampleSearchResults = [
  {
    name: "Palantir Technologies",
    uei: "UEI123",
    location: "CA, USA",
    sector: "Information Technology",
    primaryNAICS: "541511",
    lifecycleStage: "Established",
    totalAwards: "$4.2B",
    businessMomentum: "Robust",
    ownership: "Independent",
    description:
      "Founded in 2003, Palantir is a leading data analytics platform provider specializing in big data analytics for government and commercial clients.",
    contracts: 147,
    agencies: ["DoD", "CIA", "HHS"],
    revenue: "$2.3B",
    employees: "3,500+",
    clearance: "TS/SCI",
    naics: ["541511", "541512"],
    growth: "+24%",
    ageSinceFirstContract: 21,
  },
  {
    name: "Booz Allen Hamilton",
    uei: "UEI789",
    location: "VA, USA",
    sector: "Professional Services",
    primaryNAICS: "541330",
    lifecycleStage: "Legacy",
    totalAwards: "$12.8B",
    businessMomentum: "Stable",
    ownership: "Independent",
    description:
      "Established in 1914, Booz Allen Hamilton is a premier management and technology consulting firm serving government and commercial clients.",
    contracts: 892,
    agencies: ["DoD", "NASA", "DHS", "VA"],
    revenue: "$8.4B",
    employees: "29,000+",
    clearance: "TS/SCI",
    naics: ["541511", "541330"],
    growth: "+12%",
    ageSinceFirstContract: 45,
  },
  {
    name: "CACI International",
    uei: "UEI456",
    location: "VA, USA",
    sector: "Information Technology",
    primaryNAICS: "541512",
    lifecycleStage: "Legacy",
    totalAwards: "$8.9B",
    businessMomentum: "Stable",
    ownership: "Independent",
    description:
      "Founded in 1962, CACI International provides IT services and solutions for defense and intelligence communities worldwide.",
    contracts: 534,
    agencies: ["DoD", "Intel", "DHS"],
    revenue: "$6.2B",
    employees: "23,000+",
    clearance: "TS/SCI",
    naics: ["541512", "541330"],
    growth: "+8%",
    ageSinceFirstContract: 38,
  },
  {
    name: "Anduril Industries",
    uei: "UEI101",
    location: "CA, USA",
    sector: "Aerospace & Defense",
    primaryNAICS: "336414",
    lifecycleStage: "Emerging",
    totalAwards: "$1.2B",
    businessMomentum: "Explosive",
    ownership: "Independent",
    description:
      "Founded in 2017, Anduril Industries develops autonomous systems and AI technology for national security applications.",
    contracts: 73,
    agencies: ["DoD", "DHS"],
    revenue: "$890M",
    employees: "1,800+",
    clearance: "TS/SCI",
    naics: ["336414", "541712"],
    growth: "+89%",
    ageSinceFirstContract: 7,
  },
  {
    name: "Shield AI",
    uei: "UEI202",
    location: "CA, USA",
    sector: "Aerospace & Defense",
    primaryNAICS: "541712",
    lifecycleStage: "Emerging",
    totalAwards: "$450M",
    businessMomentum: "Explosive",
    ownership: "Independent",
    description:
      "Established in 2015, Shield AI builds AI pilot software enabling aircraft to operate without GPS, communications, or human oversight.",
    contracts: 42,
    agencies: ["DoD", "Air Force"],
    revenue: "$340M",
    employees: "650+",
    clearance: "Secret",
    naics: ["541712", "336411"],
    growth: "+156%",
    ageSinceFirstContract: 9,
  },
  {
    name: "Raytheon Technologies",
    uei: "UEI303",
    location: "MA, USA",
    sector: "Aerospace & Defense",
    primaryNAICS: "336414",
    lifecycleStage: "Legacy",
    totalAwards: "$89.4B",
    businessMomentum: "Stable",
    ownership: "Independent",
    description:
      "Formed in 2020 through merger, Raytheon Technologies is a global aerospace and defense leader serving aviation, defense, and space markets.",
    contracts: 1240,
    agencies: ["DoD", "NASA", "FAA"],
    revenue: "$67.1B",
    employees: "185,000+",
    clearance: "TS/SCI",
    naics: ["336414", "336415"],
    growth: "+3%",
    ageSinceFirstContract: 52,
  },
  {
    name: "Accenture Federal Services",
    uei: "UEI404",
    location: "VA, USA",
    sector: "Professional Services",
    primaryNAICS: "541511",
    lifecycleStage: "Established",
    totalAwards: "$5.7B",
    businessMomentum: "Robust",
    ownership: "Subsidiary",
    description:
      "Accenture Federal Services provides digital transformation, technology consulting, and systems integration for U.S. federal agencies.",
    contracts: 456,
    agencies: ["DoD", "DHS", "HHS", "VA"],
    revenue: "$3.2B",
    employees: "13,500+",
    clearance: "TS/SCI",
    naics: ["541511", "541512"],
    growth: "+15%",
    ageSinceFirstContract: 28,
  },
  {
    name: "General Dynamics",
    uei: "UEI505",
    location: "VA, USA",
    sector: "Aerospace & Defense",
    primaryNAICS: "336992",
    lifecycleStage: "Legacy",
    totalAwards: "$67.2B",
    businessMomentum: "Stable",
    ownership: "Independent",
    description:
      "Founded in 1952, General Dynamics provides mission-critical products across land, sea, air, and space domains worldwide.",
    contracts: 890,
    agencies: ["DoD", "Navy", "Army"],
    revenue: "$39.4B",
    employees: "103,000+",
    clearance: "TS/SCI",
    naics: ["336992", "336411"],
    growth: "+2%",
    ageSinceFirstContract: 72,
  },
];

const exportToXLSX = () => { alert("Export to XLSX coming soon!"); };
const exportToCSV = () => { alert("Export to CSV coming soon!"); };
const exportToPDF = () => { alert("Export to PDF coming soon!"); };
const exportToPPTX = () => { alert("Export to PPTX coming soon!"); };
