import { POSES } from '../../vision/constants'
import { Camera, CameraOff, Eye, Sliders } from 'lucide-react'

export default function CameraControls({
  isStreaming,
  onStartCamera,
  onStopCamera,
  isHudVisible,
  onToggleHud,
  onOpenCalibration,
  onForcePose,
  activePose,
  calibrationStatus,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/90 p-4 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isStreaming ? (
            <button
              onClick={onStopCamera}
              className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-medium transition"
            >
              <CameraOff className="h-4 w-4" /> Stop Camera
            </button>
          ) : (
            <button
              onClick={onStartCamera}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-medium transition shadow-md shadow-emerald-900/20"
            >
              <Camera className="h-4 w-4" /> Start Camera
            </button>
          )}

          <button
            onClick={onToggleHud}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isHudVisible
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4" /> {isHudVisible ? 'Hide Debug HUD' : 'Show Debug HUD'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCalibration}
            className="flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/40 px-3 py-2 text-sm font-medium text-purple-300 transition"
          >
            <Sliders className="h-4 w-4" /> Calibrate Baseline
          </button>

          <div className="text-xs text-gray-400">
            {calibrationStatus?.generic ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/80 px-2.5 py-1 text-amber-300 border border-amber-800/50">
                Generic Baseline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-1 text-emerald-300 border border-emerald-800/50">
                Calibrated ({calibrationStatus?.samples || 0} frames)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Manual Pose Test Trigger Buttons */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs font-semibold text-gray-400 mb-2">Test Pose Overrides (Force Reaction):</p>
        <div className="flex flex-wrap gap-1.5">
          {POSES.map((pose) => (
            <button
              key={pose}
              onClick={() => onForcePose(pose)}
              className={`rounded px-2 py-1 text-xs transition ${
                activePose === pose
                  ? 'bg-amber-500 font-bold text-gray-950 shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {pose}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
