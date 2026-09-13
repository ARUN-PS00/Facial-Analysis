import { Sparkles, Layers, Cpu, CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
          <Sparkles className="h-3.5 w-3.5" /> Technical Architecture
        </div>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">About Facial Analysis AI</h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          A client-side browser port of the recognition behavior from the original <b>It's Giving</b> reference implementation by gazijarin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-400" /> Reference Architecture
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            The original <code>itsgiving</code> project is Python-based (OpenCV + MediaPipe Python). In this React application, the recognition logic has been ported into clean browser JavaScript using <code>@mediapipe/tasks-vision</code> WebAssembly modules.
          </p>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Face Landmarker with 52 blendshape scores</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>2-Hand Landmarker with palm orientation & extension</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Upper-Body Pose Landmarker for elbow/shoulder tracking</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" /> Key Features & Innovations
          </h3>
          <ul className="space-y-3 text-xs text-gray-300">
            <li>
              <strong className="text-white">Personalized Baseline Calibration:</strong> Collects baseline neutral facial measurements to calculate standard deviation z-scores.
            </li>
            <li>
              <strong className="text-white">Temporal Filter:</strong> Consecutive frame arming and hold duration prevents rapid flickering.
            </li>
            <li>
              <strong className="text-white">HTML5 Overlay Canvas:</strong> Composites meme images/GIFs over video streams smoothly at 60 FPS.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
