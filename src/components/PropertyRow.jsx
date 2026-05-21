import { useState, useRef, useEffect } from 'react'
import OperatorInput, { Dropdown } from './OperatorInput'
import { DeleteIcon, ChevronDownIcon } from './Icons'
import { FREQUENCY_OPERATORS, OPERATORS_BY_TYPE } from '../data/mockData'

export default function PropertyRow({
  property,
  allProperties,
  isEvent,
  onChange,
  onDelete,
  showFrequency,
}) {
  const [propPickerOpen, setPropPickerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const propRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (propRef.current && !propRef.current.contains(e.target)) { setPropPickerOpen(false); setSearch('') } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (propPickerOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [propPickerOpen])

  const currentPropDef = allProperties.find(p => p.name === property.propertyName)

  const filtered = search
    ? allProperties.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : allProperties

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Property selector */}
      <div ref={propRef} className="relative">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors cursor-text"
          onClick={() => { if (!propPickerOpen) setPropPickerOpen(true); searchInputRef.current?.focus() }}
        >
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (!propPickerOpen) setPropPickerOpen(true) }}
            onFocus={() => { if (!propPickerOpen) setPropPickerOpen(true) }}
            placeholder={property.propertyName || 'Select property'}
            className={`flex-1 outline-none bg-transparent text-[13px] placeholder:text-gray-400 min-w-0 ${
              property.propertyName && !search ? 'placeholder:text-gray-900' : ''
            }`}
          />
          <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </div>
        {propPickerOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] overflow-hidden">
            <div className="py-1 max-h-[220px] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-[13px] text-gray-400">No results</div>
              )}
              {filtered.map(p => (
                <button
                  key={p.name}
                  onClick={() => {
                    const defaultOp = (OPERATORS_BY_TYPE[p.type] || [])[0] || ''
                    onChange({ ...property, propertyName: p.name, operator: defaultOp, value: '' })
                    setPropPickerOpen(false)
                    setSearch('')
                  }}
                  className={`w-full text-left px-3 py-[7px] text-[13px] hover:bg-gray-50 transition-colors ${
                    property.propertyName === p.name ? 'bg-gray-50 font-medium' : 'text-gray-600'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Operator + Value */}
      {currentPropDef && (
        <OperatorInput
          propertyDef={currentPropDef}
          operator={property.operator}
          value={property.value}
          onOperatorChange={(op) => onChange({ ...property, operator: op, value: '' })}
          onValueChange={(val) => onChange({ ...property, value: val })}
        />
      )}

      {/* Frequency (events only) */}
      {isEvent && showFrequency && property.operator && property.value && (
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-gray-500 whitespace-nowrap">at least</span>
          <input
            type="number"
            value={property.frequencyCount || 1}
            onChange={(e) => onChange({ ...property, frequencyCount: Math.max(1, parseInt(e.target.value) || 1) })}
            min="1"
            className="px-2 py-[5px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 w-[52px] text-center"
          />
          <span className="text-[13px] text-gray-500">{(property.frequencyCount || 1) === 1 ? 'time' : 'times'}</span>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
      >
        <DeleteIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
