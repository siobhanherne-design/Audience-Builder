import { useState, useRef, useEffect } from 'react'
import CascadingPicker from './CascadingPicker'
import PropertyRow from './PropertyRow'
import { Dropdown } from './OperatorInput'
import { EventIcon, FactIcon, AudienceIcon, DuplicateIcon, DeleteIcon, ChevronDownIcon, PlusIcon } from './Icons'
import { AUDIENCE_OPERATORS, AUDIENCES, TIMEFRAME_UNITS, OPERATORS_BY_TYPE } from '../data/mockData'

const TYPE_ICON_STYLES = {
  event: { bg: 'bg-orange-50', text: 'text-orange-500', Icon: EventIcon },
  fact: { bg: 'bg-purple-50', text: 'text-purple-500', Icon: FactIcon },
  audience: { bg: 'bg-amber-50', text: 'text-amber-500', Icon: AudienceIcon },
}

const LABEL_COL = 'w-[190px] shrink-0 text-right pr-3'

export default function RuleRow({ rule, onChange, onDuplicate, onDelete, mode = 'rule' }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mainSearch, setMainSearch] = useState('')
  const pickerRef = useRef(null)
  const mainInputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false)
        setMainSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handlePickerSelect = (selection) => {
    setPickerOpen(false)
    setMainSearch('')
    if (selection.ruleType === 'audience') {
      onChange({
        ...rule,
        ruleType: 'audience',
        audienceName: selection.audienceName,
        audienceOp: 'are members of',
        categoryName: null,
        properties: [],
      })
    } else {
      const defaultOperator = selection.propertyDef
        ? (OPERATORS_BY_TYPE[selection.propertyDef.type] || [])[0] || ''
        : ''

      const initialProperties = selection.propertyName
        ? [{ id: Date.now(), propertyName: selection.propertyName, operator: defaultOperator, value: '', frequencyOp: 'more than', frequencyCount: 1 }]
        : []

      onChange({
        ...rule,
        ruleType: selection.ruleType,
        categoryName: selection.categoryName,
        allProperties: selection.allProperties,
        properties: initialProperties,
        audienceName: null,
        audienceOp: null,
        timeframeValue: selection.ruleType === 'event' && mode === 'rule' ? 30 : null,
        timeframeUnit: selection.ruleType === 'event' && mode === 'rule' ? 'Days' : null,
      })
    }
  }

  const handleIncludeExcludeChange = (val) => {
    onChange({ ...rule, includeExclude: val })
  }

  const handlePropertyChange = (index, newProp) => {
    const updated = [...rule.properties]
    updated[index] = newProp
    onChange({ ...rule, properties: updated })
  }

  const handlePropertyDelete = (index) => {
    onChange({ ...rule, properties: rule.properties.filter((_, i) => i !== index) })
  }

  const handleAddProperty = () => {
    onChange({
      ...rule,
      properties: [
        ...rule.properties,
        { id: Date.now(), propertyName: '', operator: '', value: '', frequencyOp: 'more than', frequencyCount: 1 },
      ],
    })
  }

  const isEvent = rule.ruleType === 'event'
  const isFact = rule.ruleType === 'fact'
  const isAudience = rule.ruleType === 'audience'
  const hasSelection = rule.ruleType != null
  const typeStyle = hasSelection ? TYPE_ICON_STYLES[rule.ruleType] : null

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-4">
      {/* Row 1: Include/Exclude — profiles who — [selector] — actions */}
      <div className="flex items-center gap-2.5">
        <div className={LABEL_COL}>
          {mode === 'exit' ? (
            <span className="text-[13px] text-gray-500 whitespace-nowrap">Remove profiles when</span>
          ) : mode === 'goal' ? (
            <span className="text-[13px] text-gray-500 whitespace-nowrap">Track outcomes when</span>
          ) : (
            <div className="inline-flex items-center gap-2.5 justify-end">
              <Dropdown
                value={rule.includeExclude}
                onChange={handleIncludeExcludeChange}
                options={['Include', 'Exclude']}
              />
              <span className="text-[13px] text-gray-500 whitespace-nowrap">profiles who</span>
            </div>
          )}
        </div>

        {/* Type icon badge */}
        {hasSelection && typeStyle && (
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${typeStyle.bg}`}>
            <typeStyle.Icon className={`w-4 h-4 ${typeStyle.text}`} />
          </span>
        )}

        {/* Audience-specific controls */}
        {isAudience && (
          <>
            <Dropdown
              value={rule.audienceOp || 'are members of'}
              onChange={(val) => onChange({ ...rule, audienceOp: val })}
              options={AUDIENCE_OPERATORS}
            />
            <Dropdown
              value={rule.audienceName}
              onChange={(val) => onChange({ ...rule, audienceName: val })}
              options={AUDIENCES}
              placeholder="Select audience"
              wide
              className="flex-1"
            />
          </>
        )}

        {/* Event/Fact main selector */}
        {!isAudience && (
          <div ref={pickerRef} className="relative flex-1">
            <div
              className="w-full flex items-center px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors cursor-text"
              onClick={() => {
                if (!pickerOpen) setPickerOpen(true)
                mainInputRef.current?.focus()
              }}
            >
              <input
                ref={mainInputRef}
                type="text"
                value={mainSearch}
                onChange={(e) => {
                  setMainSearch(e.target.value)
                  if (!pickerOpen) setPickerOpen(true)
                }}
                onFocus={() => { if (!pickerOpen) setPickerOpen(true) }}
                placeholder={hasSelection ? rule.categoryName : 'Select an event, fact or audience'}
                className={`flex-1 outline-none bg-transparent text-[13px] placeholder:text-gray-400 ${
                  hasSelection && !mainSearch ? 'text-gray-900' : ''
                }`}
              />
              <ChevronDownIcon className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
            {pickerOpen && (
              <CascadingPicker
                onSelect={handlePickerSelect}
                onClose={() => { setPickerOpen(false); setMainSearch('') }}
                searchFilter={mainSearch}
              />
            )}
          </div>
        )}

        {/* Inline "in the last" timeframe (events in rule mode only) */}
        {isEvent && hasSelection && mode === 'rule' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[13px] text-gray-500 whitespace-nowrap">in the last</span>
            <Dropdown
              value={`${rule.timeframeValue || 30} ${(rule.timeframeUnit || 'Days').toLowerCase()}`}
              onChange={(val) => {
                const parts = val.match(/^(\d+)\s+(\w+)$/)
                if (parts) {
                  const unit = parts[2].charAt(0).toUpperCase() + parts[2].slice(1)
                  onChange({ ...rule, timeframeValue: parseInt(parts[1]), timeframeUnit: unit })
                }
              }}
              options={['7 days', '14 days', '30 days', '60 days', '90 days', '4 weeks', '8 weeks', '3 months', '6 months']}
              placeholder="30 days"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onDuplicate}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Duplicate rule"
          >
            <DuplicateIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Delete rule"
          >
            <DeleteIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Property rows (Event & Fact) */}
      {(isEvent || isFact) && rule.properties && rule.properties.length > 0 && (
        <div className="mt-3 space-y-2">
          {rule.properties.map((prop, index) => (
            <div key={prop.id} className="flex items-center gap-2.5">
              <div className={LABEL_COL}>
                <span className="text-[13px] text-gray-400">{index === 0 ? 'where' : 'and'}</span>
              </div>
              <PropertyRow
                property={prop}
                allProperties={rule.allProperties || []}
                isEvent={isEvent}
                showFrequency={isEvent}
                onChange={(newProp) => handlePropertyChange(index, newProp)}
                onDelete={() => handlePropertyDelete(index)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add property (Event & Fact, not Audience) */}
      {(isEvent || isFact) && hasSelection && (
        <div className="mt-3 flex items-center gap-2.5">
          <div className={LABEL_COL} />
          <button
            onClick={handleAddProperty}
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add property
          </button>
        </div>
      )}
    </div>
  )
}
