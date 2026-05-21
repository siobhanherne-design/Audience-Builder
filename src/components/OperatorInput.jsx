import { useState, useRef, useEffect } from 'react'
import { OPERATORS_BY_TYPE } from '../data/mockData'
import { ChevronDownIcon, CloseIcon } from './Icons'

function Dropdown({ value, onChange, options, placeholder = 'Select...', className = '', wide = false }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  const canSearch = options.length > 4

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && canSearch && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open, canSearch])

  const filtered = search
    ? options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleSelect = (opt) => {
    onChange(opt)
    setOpen(false)
    setSearch('')
  }

  if (canSearch) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors cursor-text ${wide ? 'w-full' : ''}`}
          onClick={() => { if (!open) setOpen(true); inputRef.current?.focus() }}
        >
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (!open) setOpen(true) }}
            onFocus={() => { if (!open) setOpen(true) }}
            placeholder={value || placeholder}
            className={`flex-1 outline-none bg-transparent text-[13px] placeholder:text-gray-400 min-w-0 ${
              value && !search ? 'placeholder:text-gray-900' : ''
            }`}
          />
          <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </div>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] overflow-hidden">
            <div className="py-1 max-h-[220px] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-[13px] text-gray-400">No results</div>
              )}
              {filtered.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-[7px] text-[13px] hover:bg-gray-50 transition-colors ${
                    value === opt ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors ${wide ? 'w-full justify-between' : ''}`}
      >
        <span className={`truncate ${value ? 'text-gray-900' : 'text-gray-400'}`}>{value || placeholder}</span>
        <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] overflow-hidden">
          <div className="py-1 max-h-[220px] overflow-y-auto">
            {filtered.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3 py-[7px] text-[13px] hover:bg-gray-50 transition-colors ${
                  value === opt ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MultiSelectChips({ values, onChange, options }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const toggle = (opt) => {
    if (values.includes(opt)) {
      onChange(values.filter(v => v !== opt))
    } else {
      onChange([...values, opt])
    }
    setSearch('')
  }

  const remove = (opt) => {
    onChange(values.filter(v => v !== opt))
  }

  const filtered = search
    ? options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
    : options

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 flex-wrap px-2 py-[5px] text-[13px] border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors min-w-[120px] min-h-[34px] cursor-pointer"
      >
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-[3px] bg-gray-100 text-gray-700 rounded text-[12px]">
            {v}
            <button onClick={(e) => { e.stopPropagation(); remove(v) }} className="text-gray-400 hover:text-gray-600">
              <CloseIcon className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (!open) setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={values.length === 0 ? 'Search or select...' : ''}
          className="flex-1 min-w-[60px] outline-none text-[13px] bg-transparent placeholder:text-gray-400 py-[2px]"
        />
        <ChevronDownIcon className="w-3 h-3 text-gray-400 shrink-0" />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] max-h-[240px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-[13px] text-gray-400">No results</div>
          )}
          {filtered.map(opt => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`w-full text-left px-3 py-[7px] text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                values.includes(opt) ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[9px] ${
                values.includes(opt) ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300'
              }`}>
                {values.includes(opt) && '✓'}
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OperatorInput({ propertyDef, operator, value, onOperatorChange, onValueChange }) {
  if (!propertyDef) return null

  const operators = OPERATORS_BY_TYPE[propertyDef.type] || []

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Dropdown
        value={operator}
        onChange={onOperatorChange}
        options={operators}
        placeholder="Select operator"
      />

      {operator && renderValueInput(propertyDef, operator, value, onValueChange)}
    </div>
  )
}

function renderValueInput(propertyDef, operator, value, onValueChange) {
  const { type, values: enumValues } = propertyDef

  if (type === 'text') {
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Enter value..."
        className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 w-[160px]"
      />
    )
  }

  if (type === 'categorical') {
    if (operator === 'is one of' || operator === 'is not one of') {
      return (
        <MultiSelectChips
          values={Array.isArray(value) ? value : []}
          onChange={onValueChange}
          options={enumValues || []}
        />
      )
    }
    return (
      <Dropdown
        value={value || ''}
        onChange={onValueChange}
        options={enumValues || []}
        placeholder="Select value"
      />
    )
  }

  if (type === 'numerical') {
    if (operator === 'is between') {
      const min = value?.min ?? ''
      const max = value?.max ?? ''
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={min}
            onChange={(e) => onValueChange({ ...value, min: e.target.value })}
            placeholder="Min"
            className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 w-[80px]"
          />
          <span className="text-[13px] text-gray-400">and</span>
          <input
            type="number"
            value={max}
            onChange={(e) => onValueChange({ ...value, max: e.target.value })}
            placeholder="Max"
            className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 w-[80px]"
          />
        </div>
      )
    }
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="0"
        className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 w-[80px]"
      />
    )
  }

  if (type === 'date') {
    if (operator === 'is between') {
      return (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value?.from || ''}
            onChange={(e) => onValueChange({ ...value, from: e.target.value })}
            className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
          />
          <span className="text-[13px] text-gray-400">and</span>
          <input
            type="date"
            value={value?.to || ''}
            onChange={(e) => onValueChange({ ...value, to: e.target.value })}
            className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
          />
        </div>
      )
    }
    return (
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="px-3 py-[7px] text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
      />
    )
  }

  return null
}

export { Dropdown }
