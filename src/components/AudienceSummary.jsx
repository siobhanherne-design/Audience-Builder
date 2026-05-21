import { useState } from 'react'
import { estimateProfiles } from '../data/estimateProfiles'
import { ChevronDownIcon } from './Icons'

function describeRule(rule) {
  if (rule.ruleType === 'audience') {
    const op = rule.audienceOp || 'are members of'
    return `profiles who ${op} **${rule.audienceName}**`
  }

  let desc = `Profiles who **${rule.categoryName}**`

  if (rule.properties && rule.properties.length > 0) {
    const propParts = rule.properties
      .filter(p => p.propertyName)
      .map(p => {
        let part = ` · ${p.propertyName}`
        if (p.operator) part += ` ${p.operator}`
        if (p.value) {
          if (typeof p.value === 'object' && !Array.isArray(p.value)) {
            if (p.value.min !== undefined) part += ` ${p.value.min} and ${p.value.max}`
            else if (p.value.from) part += ` ${p.value.from} and ${p.value.to}`
          } else if (Array.isArray(p.value)) {
            part += ` ${p.value.join(', ')}`
          } else {
            part += ` **${p.value}**`
          }
        }
        if (rule.ruleType === 'event' && p.frequencyOp && p.frequencyCount) {
          part += ` at least **${p.frequencyCount}** ${p.frequencyCount === 1 ? 'time' : 'times'}`
        }
        return part
      })
    desc += propParts.join(' and')
  }

  if (rule.ruleType === 'event' && rule.timeframeValue) {
    desc += ` in the last **${rule.timeframeValue}** ${rule.timeframeUnit || 'Days'}`
  }

  return desc
}

export default function AudienceSummary({ rules, junctions, exitRules = [], exitJunctions = [], membershipDuration = '30 days' }) {
  const [expanded, setExpanded] = useState(true)
  const validRules = rules.filter(r => r.ruleType && (r.categoryName || r.audienceName))
  const validExitRules = exitRules.filter(r => r.ruleType && (r.categoryName || r.audienceName))
  const estimated = estimateProfiles(rules, junctions)

  const formatNumber = (n) => n.toLocaleString()

  return (
    <div className="pt-2 pb-2">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-2"
      >
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? '' : 'rotate-180'}`} />
        <h3 className="text-[15px] font-semibold text-gray-900">Audience summary</h3>
      </button>

      {expanded && (
        <div className="flex">
          {/* Left side: rule descriptions */}
          <div className="flex-1 min-w-0 max-h-[160px] overflow-y-auto picker-scroll pl-6 mt-1">
            <div className="space-y-1">
              {validRules.length === 0 && (
                <p className="text-[13px] text-gray-400 italic">Add rules above to see a summary</p>
              )}

              {validRules.map((rule, i) => {
                const originalIndex = rules.indexOf(rule)
                const junction = originalIndex > 0 ? junctions[originalIndex - 1] : null
                const prevRule = i > 0 ? validRules[i - 1] : null
                const sameGroup = prevRule && prevRule.includeExclude === rule.includeExclude
                const showLabel = !sameGroup

                return (
                  <div key={rule.id}>
                    <div className="flex items-start gap-3">
                      <span className="text-[13px] font-semibold shrink-0 w-[60px] text-gray-900">
                        {showLabel ? rule.includeExclude : ''}
                      </span>
                      <p
                        className="text-[13px] text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: (sameGroup && junction ? `<strong class="text-gray-900 font-semibold">${junction}</strong> ` : '') +
                            describeRule(rule).replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>'),
                        }}
                      />
                    </div>
                  </div>
                )
              })}

              {validExitRules.map((rule, i) => {
                const originalIndex = exitRules.indexOf(rule)
                const junction = originalIndex > 0 ? exitJunctions[originalIndex - 1] : null

                return (
                  <div key={rule.id}>
                    <div className="flex items-start gap-3">
                      <span className="text-[13px] font-semibold shrink-0 w-[60px] text-gray-900">
                        {i === 0 ? 'Exit' : ''}
                      </span>
                      <p
                        className="text-[13px] text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: (i > 0 && junction ? `<strong class="text-gray-900 font-semibold">${junction}</strong> ` : '') +
                            describeRule(rule).replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>'),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-l border-gray-200 mx-8 shrink-0" />

          {/* Right side: estimated profiles */}
          <div className="shrink-0 flex flex-col justify-center items-end">
            <p className="text-[28px] font-bold text-gray-900 tracking-[-0.5px]">
              ~{formatNumber(estimated)}
            </p>
            <p className="text-[13px] text-gray-500 mt-0.5">Estimated profiles</p>
          </div>
        </div>
      )}
    </div>
  )
}
