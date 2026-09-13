

export default function CalibrationModal({ isOpen, onClose, onStartCalibration, progress, warnings }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-6 text-white shadow-2xl">
        <h3 className="text-xl font-bold text-emerald-400 mb-2">Personal Facial Calibration</h3>
        <p className="text-gray-300 text-sm mb-4">
          To accurately recognize your facial expressions and avoid false triggers, we need to calibrate against your neutral resting face.
        </p>

        <div className="bg-gray-800/80 rounded-xl p-4 mb-5 border border-gray-700 text-xs text-gray-300 space-y-2">
          <p className="font-semibold text-emerald-300">Instructions during calibration:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Look directly at the camera naturally.</li>
            <li>Keep a bored / neutral expression.</li>
            <li>Blinking is fine. Do not talk, smile, or scrunch your nose.</li>
          </ul>
        </div>

        {progress !== null && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Calibrating Baseline...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {warnings && warnings.length > 0 && (
          <div className="mb-5 rounded-lg bg-amber-950/60 border border-amber-500/40 p-3 text-xs text-amber-200">
            <p className="font-semibold mb-1">Calibration Feedback:</p>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onStartCalibration}
            disabled={progress !== null && progress < 100}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
          >
            {progress === null ? 'Begin 5s Calibration' : progress >= 100 ? 'Done' : 'Calibrating...'}
          </button>
        </div>
      </div>
    </div>
  )
}
