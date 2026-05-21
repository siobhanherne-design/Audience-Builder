export default function AndOrToggle({ value, onChange }) {
  return (
    <div className="flex items-center py-2 -ml-1">
      <div className="inline-flex rounded-full bg-gray-100 p-[3px]">
        <button
          onClick={() => onChange('AND')}
          className={`px-3.5 py-[5px] text-[12px] font-semibold rounded-full transition-all ${
            value === 'AND'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          AND
        </button>
        <button
          onClick={() => onChange('OR')}
          className={`px-3.5 py-[5px] text-[12px] font-semibold rounded-full transition-all ${
            value === 'OR'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          OR
        </button>
      </div>
    </div>
  )
}
