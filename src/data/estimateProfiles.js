const TOTAL_UNIVERSE = 850000

const KNOWN_COUNTS = {
  'Viewed product': 312000,
  'Viewed product|Product department|Womens': 127400,
  'Viewed product|Brand|HairShine': 43200,
  'Completed purchase': 89500,
  'Completed purchase|Order value|more than|200': 31200,
  'Add to cart': 198000,
  'Abandoned checkout': 67800,
  'Email click': 145000,
  'Email open': 234000,
  'Loyalty|Tier|Gold': 38900,
  'Loyalty|Tier|Platinum': 12400,
  'Customer details|Gender|Female': 412000,
  'Lifecycle|Stage|Active': 287000,
  'Lifecycle|Stage|Lapsed': 94000,
  'Active Email Subscribers': 356000,
  'VIP Customers': 18500,
  'At Risk Customers': 67200,
  'Win-back Candidates': 43800,
}

function hashString(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff
  }
  return hash
}

function deterministicCount(ruleString) {
  const hash = hashString(ruleString)
  return 15000 + (hash % (450000 - 15000))
}

function getRuleKey(rule) {
  if (rule.ruleType === 'audience') {
    return rule.audienceName || ''
  }

  const parts = []
  if (rule.ruleType === 'event' && rule.categoryName) {
    parts.push(rule.categoryName)
  }
  if (rule.ruleType === 'fact' && rule.categoryName) {
    parts.push(rule.categoryName)
  }

  if (rule.properties && rule.properties.length > 0) {
    for (const prop of rule.properties) {
      if (prop.propertyName && prop.operator && prop.value) {
        if (rule.ruleType === 'event') {
          parts.push(prop.propertyName)
          if (prop.operator === 'more than' || prop.operator === 'less than' || prop.operator === 'exactly') {
            parts.push(prop.operator)
            parts.push(String(prop.value))
          } else {
            parts.push(String(prop.value))
          }
        } else {
          parts.push(prop.propertyName)
          parts.push(String(prop.value))
        }
      }
    }
  }

  return parts.join('|')
}

function getSingleRuleCount(rule) {
  const key = getRuleKey(rule)

  if (KNOWN_COUNTS[key] !== undefined) {
    return KNOWN_COUNTS[key]
  }

  for (const [knownKey, count] of Object.entries(KNOWN_COUNTS)) {
    if (key.startsWith(knownKey) || knownKey.startsWith(key)) {
      return count
    }
  }

  if (key) {
    return deterministicCount(key)
  }

  return TOTAL_UNIVERSE
}

export function estimateProfiles(rules, junctions) {
  if (!rules || rules.length === 0) return 0

  const validRules = rules.filter(r => {
    if (r.ruleType === 'audience') return !!r.audienceName
    return !!r.categoryName
  })

  if (validRules.length === 0) return 0

  const includeRules = validRules.filter(r => r.includeExclude === 'Include')
  const excludeRules = validRules.filter(r => r.includeExclude === 'Exclude')

  let includeCount = 0
  if (includeRules.length > 0) {
    includeCount = getSingleRuleCount(includeRules[0])

    for (let i = 1; i < includeRules.length; i++) {
      const nextCount = getSingleRuleCount(includeRules[i])
      const junctionIndex = validRules.indexOf(includeRules[i]) - 1
      const junction = junctions[junctionIndex] || 'AND'

      if (junction === 'AND') {
        const pct1 = includeCount / TOTAL_UNIVERSE
        const pct2 = nextCount / TOTAL_UNIVERSE
        includeCount = Math.floor(pct1 * pct2 * TOTAL_UNIVERSE)
      } else {
        includeCount = Math.floor(includeCount + nextCount - (includeCount + nextCount) * 0.2)
      }
    }
  }

  let excludeCount = 0
  for (const rule of excludeRules) {
    excludeCount += getSingleRuleCount(rule)
  }

  let result = includeCount > 0 ? includeCount : (excludeCount > 0 ? TOTAL_UNIVERSE : 0)
  if (excludeCount > 0 && includeCount > 0) {
    const excludePct = excludeCount / TOTAL_UNIVERSE
    result = Math.floor(result * (1 - excludePct * 0.6))
  }

  return Math.max(0, Math.min(result, TOTAL_UNIVERSE))
}
