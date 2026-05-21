import { useState } from 'react'
import { EVENTS, FACTS, AUDIENCES } from '../data/mockData'
import { EventIcon, FactIcon, AudienceIcon } from './Icons'

const TYPES = [
  { key: 'event', label: 'Events', subtitle: 'What they did', Icon: EventIcon },
  { key: 'fact', label: 'Facts', subtitle: 'Who they are', Icon: FactIcon },
  { key: 'audience', label: 'Audiences', subtitle: 'Existing segment', Icon: AudienceIcon },
]

const TYPE_COLORS = {
  event: {
    text: 'text-orange-600',
    icon: 'text-orange-500',
    iconBg: 'bg-orange-50 border-orange-100',
    selectedBg: 'bg-orange-50',
    selectedIconBg: 'bg-orange-100 border-orange-200',
  },
  fact: {
    text: 'text-purple-600',
    icon: 'text-purple-500',
    iconBg: 'bg-purple-50 border-purple-100',
    selectedBg: 'bg-purple-50',
    selectedIconBg: 'bg-purple-100 border-purple-200',
  },
  audience: {
    text: 'text-blue-600',
    icon: 'text-blue-500',
    iconBg: 'bg-blue-50 border-blue-100',
    selectedBg: 'bg-amber-50',
    selectedIconBg: 'bg-blue-100 border-blue-200',
  },
}

export default function CascadingPicker({ onSelect, onClose, searchFilter = '' }) {
  const [hoveredType, setHoveredType] = useState('event')
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const externalSearch = searchFilter.trim().toLowerCase()

  // --- Flat search mode ---
  if (externalSearch) {
    const results = []

    EVENTS.forEach(e => {
      if (e.name.toLowerCase().includes(externalSearch)) {
        results.push({ type: 'event', label: e.name, category: e.name, icon: EventIcon, color: TYPE_COLORS.event })
      }
      e.properties.forEach(p => {
        if (p.name.toLowerCase().includes(externalSearch)) {
          results.push({ type: 'event', label: `${e.name} · ${p.name}`, category: e.name, property: p.name, icon: EventIcon, color: TYPE_COLORS.event })
        }
      })
    })

    FACTS.forEach(f => {
      if (f.name.toLowerCase().includes(externalSearch)) {
        results.push({ type: 'fact', label: f.name, category: f.name, icon: FactIcon, color: TYPE_COLORS.fact })
      }
      f.properties.forEach(p => {
        if (p.name.toLowerCase().includes(externalSearch)) {
          results.push({ type: 'fact', label: `${f.name} · ${p.name}`, category: f.name, property: p.name, icon: FactIcon, color: TYPE_COLORS.fact })
        }
      })
    })

    AUDIENCES.forEach(a => {
      if (a.toLowerCase().includes(externalSearch)) {
        results.push({ type: 'audience', label: a, audienceName: a, icon: AudienceIcon, color: TYPE_COLORS.audience })
      }
    })

    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-full min-w-[400px]">
        <div className="py-1 max-h-[300px] overflow-y-auto">
          {results.length === 0 && (
            <div className="px-4 py-3 text-[13px] text-gray-400">No results found</div>
          )}
          {results.map((r, i) => {
            const Icon = r.icon
            return (
              <button
                key={`${r.type}-${r.label}-${i}`}
                onClick={() => {
                  if (r.type === 'audience') {
                    onSelect({ ruleType: 'audience', audienceName: r.audienceName })
                  } else {
                    const source = r.type === 'event' ? EVENTS : FACTS
                    const cat = source.find(s => s.name === r.category)
                    const propDef = r.property ? cat?.properties.find(p => p.name === r.property) : null
                    onSelect({
                      ruleType: r.type,
                      categoryName: r.category,
                      propertyName: r.property || null,
                      propertyDef: propDef || null,
                      allProperties: cat?.properties || [],
                    })
                  }
                }}
                className="w-full text-left px-4 py-[9px] text-[13px] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md border ${r.color.iconBg}`}>
                  <Icon className={`w-3 h-3 ${r.color.icon}`} />
                </span>
                <span>{r.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // --- Normal hover-driven 3-column view ---
  const getColumn2Items = () => {
    if (hoveredType === 'event') return EVENTS.map(e => e.name)
    if (hoveredType === 'fact') return FACTS.map(f => f.name)
    if (hoveredType === 'audience') return AUDIENCES
    return []
  }

  const activeCategory = hoveredCategory || getColumn2Items()[0] || null

  const getColumn3Items = () => {
    if (!activeCategory || hoveredType === 'audience') return []
    if (hoveredType === 'event') {
      const event = EVENTS.find(e => e.name === activeCategory)
      return event ? ['Any', ...event.properties.map(p => p.name)] : []
    }
    if (hoveredType === 'fact') {
      const fact = FACTS.find(f => f.name === activeCategory)
      return fact ? ['Any', ...fact.properties.map(p => p.name)] : []
    }
    return []
  }

  const handleColumn2Click = (item) => {
    if (hoveredType === 'audience') {
      onSelect({ ruleType: 'audience', audienceName: item })
      return
    }
  }

  const handleColumn3Click = (propertyName) => {
    const isAny = propertyName === 'Any'
    if (hoveredType === 'event') {
      const event = EVENTS.find(e => e.name === activeCategory)
      onSelect({
        ruleType: 'event',
        categoryName: activeCategory,
        propertyName: isAny ? null : propertyName,
        propertyDef: isAny ? null : event?.properties.find(p => p.name === propertyName),
        allProperties: event?.properties || [],
      })
    } else if (hoveredType === 'fact') {
      const fact = FACTS.find(f => f.name === activeCategory)
      onSelect({
        ruleType: 'fact',
        categoryName: activeCategory,
        propertyName: isAny ? null : propertyName,
        propertyDef: isAny ? null : fact?.properties.find(p => p.name === propertyName),
        allProperties: fact?.properties || [],
      })
    }
  }

  const col2Items = getColumn2Items()
  const col3Items = getColumn3Items()

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg flex overflow-hidden picker-columns" style={{ minWidth: 580 }}>
      {/* Column 1: Types */}
      <div className="w-[170px] border-r border-gray-100 py-1.5">
        {TYPES.map(({ key, label, subtitle, Icon }) => {
          const c = TYPE_COLORS[key]
          const isActive = hoveredType === key
          return (
            <button
              key={key}
              onMouseEnter={() => { setHoveredType(key); setHoveredCategory(null) }}
              onClick={() => { setHoveredType(key); setHoveredCategory(null) }}
              className={`w-full text-left px-3.5 py-3 flex items-center gap-2.5 transition-colors ${
                isActive ? c.selectedBg : 'hover:bg-gray-50'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${
                isActive ? c.selectedIconBg : c.iconBg
              }`}>
                <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
              </span>
              <div>
                <div className={`text-[13px] font-medium leading-tight ${isActive ? c.text : 'text-gray-900'}`}>
                  {label}
                </div>
                <div className="text-[11px] text-gray-400 leading-tight">{subtitle}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Column 2: Categories / Items */}
      {hoveredType && (
        <div className={`w-[210px] py-1.5 max-h-[296px] overflow-y-auto picker-scroll ${col3Items.length > 0 ? 'border-r border-gray-100' : ''}`}>
          {col2Items.map(item => {
            const isActive = activeCategory === item
            return (
              <button
                key={item}
                onMouseEnter={() => setHoveredCategory(item)}
                onClick={() => handleColumn2Click(item)}
                className={`w-full text-left px-4 py-[9px] text-[13px] transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      )}

      {/* Column 3: Properties */}
      {col3Items.length > 0 && (
        <div className="w-[200px] py-1.5 max-h-[296px] overflow-y-auto picker-scroll">
          {col3Items.map(item => (
            <button
              key={item}
              onClick={() => handleColumn3Click(item)}
              className="w-full text-left px-4 py-[9px] text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
