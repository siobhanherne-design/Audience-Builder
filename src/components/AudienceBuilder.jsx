import { useState, useEffect, useRef, useCallback } from 'react'
import RuleRow from './RuleRow'
import AndOrToggle from './AndOrToggle'
import AudienceSummary from './AudienceSummary'
import { Dropdown } from './OperatorInput'
import { PlusIcon, DuplicateIcon, DeleteIcon } from './Icons'
import { CONNECTOR_SOURCES, PAST_ACTIVITY_PERIODS } from '../data/mockData'

const TABS = ['Entry rules', 'Exit rules', 'Goals', 'Destinations', 'Audience details']

function createEmptyRule() {
  return {
    id: Date.now() + Math.random(),
    includeExclude: 'Include',
    ruleType: null,
    categoryName: null,
    audienceName: null,
    audienceOp: null,
    properties: [],
    allProperties: [],
    timeframeValue: null,
    timeframeUnit: 'Days',
    coOccurrenceValue: 7,
    coOccurrenceUnit: 'Days',
  }
}

export default function AudienceBuilder() {
  const [rules, setRules] = useState([createEmptyRule()])
  const [junctions, setJunctions] = useState([])
  const [exitRules, setExitRules] = useState([createEmptyRule()])
  const [exitJunctions, setExitJunctions] = useState([])
  const [goalRules, setGoalRules] = useState([createEmptyRule()])
  const [goalJunctions, setGoalJunctions] = useState([])
  const [membershipDuration, setMembershipDuration] = useState('30 days')
  const [connectors, setConnectors] = useState([{ id: Date.now(), source: null, account: null }])
  const [pastActivityEnabled, setPastActivityEnabled] = useState(true)
  const [pastActivityPeriod, setPastActivityPeriod] = useState('Last 30 days')
  const [audienceName, setAudienceName] = useState('')
  const [audienceDescription, setAudienceDescription] = useState('')
  const [folder, setFolder] = useState(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [activeTab, setActiveTab] = useState('Entry rules')
  const tabsContainerRef = useRef(null)
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback((tab) => {
    const el = tabRefs.current[tab]
    const container = tabsContainerRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = el.getBoundingClientRect()
      setIndicator({ left: tabRect.left - containerRect.left, width: tabRect.width })
    }
  }, [])

  useEffect(() => {
    updateIndicator(activeTab)
  }, [activeTab, updateIndicator])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 80)
  }, [rules, exitRules])

  const handleRuleChange = (index, updatedRule) => {
    const updated = [...rules]
    updated[index] = updatedRule
    setRules(updated)
  }

  const handleAddRule = () => {
    setRules([...rules, createEmptyRule()])
    setJunctions([...junctions, 'AND'])
  }

  const handleDeleteRule = (index) => {
    if (rules.length <= 1) return
    const newRules = rules.filter((_, i) => i !== index)
    const newJunctions = [...junctions]
    if (index === 0 && newJunctions.length > 0) {
      newJunctions.shift()
    } else if (index > 0) {
      newJunctions.splice(index - 1, 1)
    }
    setRules(newRules)
    setJunctions(newJunctions)
  }

  const handleDuplicateRule = (index) => {
    const clone = { ...rules[index], id: Date.now() + Math.random(), properties: rules[index].properties.map(p => ({ ...p, id: Date.now() + Math.random() })) }
    const newRules = [...rules]
    newRules.splice(index + 1, 0, clone)
    const newJunctions = [...junctions]
    newJunctions.splice(index, 0, 'AND')
    setRules(newRules)
    setJunctions(newJunctions)
  }

  const handleJunctionChange = (index, value) => {
    const updated = [...junctions]
    updated[index] = value
    setJunctions(updated)
  }

  const handleExitRuleChange = (index, updatedRule) => {
    const updated = [...exitRules]
    updated[index] = updatedRule
    setExitRules(updated)
  }

  const handleAddExitRule = () => {
    setExitRules([...exitRules, createEmptyRule()])
    setExitJunctions([...exitJunctions, 'AND'])
  }

  const handleDeleteExitRule = (index) => {
    if (exitRules.length <= 1) return
    const newRules = exitRules.filter((_, i) => i !== index)
    const newJunctions = [...exitJunctions]
    if (index === 0 && newJunctions.length > 0) {
      newJunctions.shift()
    } else if (index > 0) {
      newJunctions.splice(index - 1, 1)
    }
    setExitRules(newRules)
    setExitJunctions(newJunctions)
  }

  const handleDuplicateExitRule = (index) => {
    const clone = { ...exitRules[index], id: Date.now() + Math.random(), properties: exitRules[index].properties.map(p => ({ ...p, id: Date.now() + Math.random() })) }
    const newRules = [...exitRules]
    newRules.splice(index + 1, 0, clone)
    const newJunctions = [...exitJunctions]
    newJunctions.splice(index, 0, 'AND')
    setExitRules(newRules)
    setExitJunctions(newJunctions)
  }

  const handleExitJunctionChange = (index, value) => {
    const updated = [...exitJunctions]
    updated[index] = value
    setExitJunctions(updated)
  }

  const handleGoalRuleChange = (index, updatedRule) => {
    const updated = [...goalRules]
    updated[index] = updatedRule
    setGoalRules(updated)
  }

  const handleAddGoalRule = () => {
    setGoalRules([...goalRules, createEmptyRule()])
    setGoalJunctions([...goalJunctions, 'AND'])
  }

  const handleDeleteGoalRule = (index) => {
    if (goalRules.length <= 1) return
    const newRules = goalRules.filter((_, i) => i !== index)
    const newJunctions = [...goalJunctions]
    if (index === 0 && newJunctions.length > 0) {
      newJunctions.shift()
    } else if (index > 0) {
      newJunctions.splice(index - 1, 1)
    }
    setGoalRules(newRules)
    setGoalJunctions(newJunctions)
  }

  const handleDuplicateGoalRule = (index) => {
    const clone = { ...goalRules[index], id: Date.now() + Math.random(), properties: goalRules[index].properties.map(p => ({ ...p, id: Date.now() + Math.random() })) }
    const newRules = [...goalRules]
    newRules.splice(index + 1, 0, clone)
    const newJunctions = [...goalJunctions]
    newJunctions.splice(index, 0, 'AND')
    setGoalRules(newRules)
    setGoalJunctions(newJunctions)
  }

  const handleGoalJunctionChange = (index, value) => {
    const updated = [...goalJunctions]
    updated[index] = value
    setGoalJunctions(updated)
  }

  const handleConnectorChange = (index, field, value) => {
    const updated = [...connectors]
    if (field === 'source') {
      updated[index] = { ...updated[index], source: value, account: null }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setConnectors(updated)
  }

  const handleAddConnector = () => {
    setConnectors([...connectors, { id: Date.now() + Math.random(), source: null, account: null }])
  }

  const handleDeleteConnector = (index) => {
    if (connectors.length <= 1) return
    setConnectors(connectors.filter((_, i) => i !== index))
  }

  const handleDuplicateConnector = (index) => {
    const clone = { ...connectors[index], id: Date.now() + Math.random() }
    const updated = [...connectors]
    updated.splice(index + 1, 0, clone)
    setConnectors(updated)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* White header area */}
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="pt-10 pb-4">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-[-0.3px]">New Audience</h1>
          </div>

          {/* Tabs */}
          <div ref={tabsContainerRef} className="flex gap-6 border-b border-gray-200 relative">
            {TABS.map(tab => (
              <button
                key={tab}
                ref={(el) => { tabRefs.current[tab] = el }}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? 'text-[#1B5F98]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
            <span
              className="absolute bottom-0 h-[2px] bg-[#1B5F98] rounded-t transition-all duration-300 ease-in-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          </div>
        </div>
      </div>

      {/* Grey content area */}
      <div className="flex-1 pb-[220px]">
        <div key={activeTab} className="max-w-[1100px] mx-auto px-8 py-8 tab-content">
          {activeTab === 'Entry rules' && (
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Entry rules</h2>
              <p className="text-[13px] text-gray-500 mt-0.5 mb-3">Define who is included in this audience based on events or profile data.</p>

              <div>
                {rules.map((rule, index) => (
                  <div key={rule.id}>
                    {index > 0 && (
                      <AndOrToggle
                        value={junctions[index - 1] || 'AND'}
                        onChange={(val) => handleJunctionChange(index - 1, val)}
                      />
                    )}
                    <RuleRow
                      rule={rule}
                      onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
                      onDuplicate={() => handleDuplicateRule(index)}
                      onDelete={() => handleDeleteRule(index)}
                    />
                  </div>
                ))}
              </div>

              {rules.some(r => r.ruleType != null) && (
                <div className="mt-4">
                  <button
                    onClick={handleAddRule}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add rule
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Exit rules' && (
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-[15px] font-semibold text-gray-900">Exit rules</h2>
                <span className="px-2 py-0.5 text-[11px] font-medium text-[#1B5F98] border border-[#1B5F98]/30 rounded-full">Optional</span>
              </div>
              <p className="text-[13px] text-gray-500 mb-3">Stop targeting profiles when they convert or opt out to prevent wasted messaging</p>

              <div>
                {exitRules.map((rule, index) => (
                  <div key={rule.id}>
                    {index > 0 && (
                      <AndOrToggle
                        value={exitJunctions[index - 1] || 'AND'}
                        onChange={(val) => handleExitJunctionChange(index - 1, val)}
                      />
                    )}
                    <RuleRow
                      rule={rule}
                      mode="exit"
                      onChange={(updatedRule) => handleExitRuleChange(index, updatedRule)}
                      onDuplicate={() => handleDuplicateExitRule(index)}
                      onDelete={() => handleDeleteExitRule(index)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleAddExitRule}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add rule
                </button>
              </div>

              {/* Membership duration */}
              <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900">Membership duration</h3>
                    <p className="text-[13px] text-gray-500 mt-0.5">Remove inactive profiles from this audience after a set period to keep targeting relevant</p>
                  </div>
                  <Dropdown
                    value={membershipDuration}
                    onChange={setMembershipDuration}
                    options={['7 days', '14 days', '30 days', '60 days', '90 days', '6 months', '12 months']}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Goals' && (
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-[15px] font-semibold text-gray-900">Goals</h2>
                <span className="px-2 py-0.5 text-[11px] font-medium text-[#1B5F98] border border-[#1B5F98]/30 rounded-full">Optional</span>
              </div>
              <p className="text-[13px] text-gray-500 mb-3">Measure whether this audience is contributing to key outcomes like purchases or sign-ups.</p>

              <div>
                {goalRules.map((rule, index) => (
                  <div key={rule.id}>
                    {index > 0 && (
                      <AndOrToggle
                        value={goalJunctions[index - 1] || 'AND'}
                        onChange={(val) => handleGoalJunctionChange(index - 1, val)}
                      />
                    )}
                    <RuleRow
                      rule={rule}
                      mode="goal"
                      onChange={(updatedRule) => handleGoalRuleChange(index, updatedRule)}
                      onDuplicate={() => handleDuplicateGoalRule(index)}
                      onDelete={() => handleDeleteGoalRule(index)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleAddGoalRule}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add goal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Destinations' && (
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Destinations</h2>
              <p className="text-[13px] text-gray-500 mt-0.5 mb-3">Choose where to activate this audience, such as ad platforms, email tools, or CRM systems.</p>

              <div className="space-y-3">
                {connectors.map((conn, index) => {
                  const sourceDef = conn.source ? CONNECTOR_SOURCES.find(s => s.name === conn.source) : null
                  const accountOptions = sourceDef ? sourceDef.accounts.map(a => a.name) : []
                  const accountDef = sourceDef && conn.account ? sourceDef.accounts.find(a => a.name === conn.account) : null

                  return (
                    <div key={conn.id} className="bg-white border border-gray-200/80 rounded-xl px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[13px] text-gray-500 whitespace-nowrap shrink-0">Send Audience to</span>

                        {/* Source dropdown with icon */}
                        <div className="relative">
                          <div className="flex items-center">
                            {sourceDef && (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 mr-2 text-white text-[11px] font-bold"
                                style={{ backgroundColor: sourceDef.color }}
                              >
                                {sourceDef.name.charAt(0)}
                              </span>
                            )}
                            <Dropdown
                              value={conn.source}
                              onChange={(val) => handleConnectorChange(index, 'source', val)}
                              options={CONNECTOR_SOURCES.map(s => s.name)}
                              placeholder="Select source"
                            />
                          </div>
                        </div>

                        {/* Account dropdown */}
                        {conn.source && (
                          <div className="flex-1">
                            <Dropdown
                              value={conn.account}
                              onChange={(val) => handleConnectorChange(index, 'account', val)}
                              options={accountOptions}
                              placeholder="Select account"
                              wide
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => handleDuplicateConnector(index)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            title="Duplicate connector"
                          >
                            <DuplicateIcon className="w-[18px] h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDeleteConnector(index)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            title="Delete connector"
                          >
                            <DeleteIcon className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleAddConnector}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add destination
                </button>
              </div>

              {/* Include profiles from past activity */}
              <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setPastActivityEnabled(!pastActivityEnabled)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        pastActivityEnabled
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {pastActivityEnabled && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-gray-900">Include profiles from past activity</h3>
                        <span className="px-2 py-0.5 text-[11px] font-medium text-[#1B5F98] border border-[#1B5F98]/30 rounded-full">Optional</span>
                      </div>
                      <p className="text-[13px] text-gray-500 mt-0.5">Add profiles that already meet the audience rules using activity from the selected time period.</p>
                    </div>
                  </div>
                  {pastActivityEnabled && (
                    <div className="shrink-0 ml-4">
                      <Dropdown
                        value={pastActivityPeriod}
                        onChange={setPastActivityPeriod}
                        options={PAST_ACTIVITY_PERIODS}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Audience details' && (
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Audience details</h2>
              <p className="text-[13px] text-gray-500 mt-0.5 mb-3">Organise this audience so you and your team can find it easily later.</p>

              <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-5 space-y-5">
                {/* Audience Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">
                    <span className="text-red-500 mr-0.5">*</span>Audience Name
                  </label>
                  <input
                    type="text"
                    value={audienceName}
                    onChange={(e) => setAudienceName(e.target.value)}
                    placeholder="e.g Lapsed Buyers - 90 days - Q3 Winback"
                    className="w-full px-3 py-[9px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">Description</label>
                  <input
                    type="text"
                    value={audienceDescription}
                    onChange={(e) => setAudienceDescription(e.target.value)}
                    placeholder="e.g No activity in 90+ days, Klaviyo + Google Ads, Q3 win-back campaign"
                    className="w-full px-3 py-[9px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                  />
                </div>

                {/* Folder & Tags side by side */}
                <div className="flex gap-5">
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">Folder</label>
                    <Dropdown
                      value={folder}
                      onChange={setFolder}
                      options={['Marketing', 'Retention', 'Acquisition', 'Seasonal', 'Testing']}
                      placeholder="Select folder"
                      wide
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">Tags / labels</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                          e.preventDefault()
                          const newTag = tagInput.trim().replace(/,$/, '')
                          if (newTag && !tags.includes(newTag)) {
                            setTags([...tags, newTag])
                          }
                          setTagInput('')
                        }
                      }}
                      placeholder="e.g Q3, Klaviyo, Retention"
                      className="w-full px-3 py-[9px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                    />
                    <p className="text-[12px] text-gray-400 mt-1">To group and filter audiences</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-[12px] text-gray-700 rounded-md border border-blue-100">
                            {tag}
                            <button
                              onClick={() => setTags(tags.filter(t => t !== tag))}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-[1100px] mx-auto px-8">
          <AudienceSummary rules={rules} junctions={junctions} exitRules={exitRules} exitJunctions={exitJunctions} membershipDuration={membershipDuration} />
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <button className="px-5 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            {rules.some(r => r.ruleType != null) && (
              <div className="flex items-center gap-3">
                <button className="px-5 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Save draft
                </button>
                <button
                  onClick={() => {
                    const currentIndex = TABS.indexOf(activeTab)
                    if (currentIndex < TABS.length - 1) {
                      setActiveTab(TABS[currentIndex + 1])
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="px-5 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {activeTab === 'Audience details' ? 'Save and publish' : 'Save and continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
